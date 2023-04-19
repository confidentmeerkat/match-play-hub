import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, View, Image, Keyboard, TouchableOpacity, TextInput, Platform, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Colors from "../../constants/Colors";
import images from "../../resources/images";
import BackgroundButton from "../../components/buttons/BackgroundButton";
import { AuthStyle } from "../../../assets/styles/AuthStyle";
import strings from "../../resources/languages/strings";
import errors from "../../resources/languages/errors";
import { isPassword, isValidMobile, showErrorMessage } from "../../utils/helpers";
import font_type from "../../resources/fonts";
import Loader from "../../components/loaders/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import * as globals from "../../utils/Globals";
import { doLogin, doRefreshToken, doGetUser } from "../../redux/actions/AuthActions";
import { CommonActions } from "@react-navigation/native";
import TextTicker from "react-native-text-ticker";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import Video from "react-native-video";

let logoRef = React.createRef();
class LoginScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidePassword: true,
      mobilenum: "",
      password: "",
      errMobile: "",
      errPassword: "",
      fcmToken: "",
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate = async (prevProps) => {
    if (prevProps.responseLogin !== this.props.responseLogin) {
      if (this.props.responseLogin !== undefined) {
        const { token, success, error, message, status_code } = this.props.responseLogin;
        if (status_code == 200 && success == true) {
          AsyncStorage.setItem(prefEnum.TAG_API_TOKEN, token);
          globals.access_token = token;
          this.props.doGetUser();
        } else {
          if (error) {
            if (error.phone) {
              showErrorMessage(error.phone);
            }
          } else {
            showErrorMessage(message);
          }
        }
      }
    }
    if (prevProps.responseUserdata !== this.props.responseUserdata) {
      if (this.props.responseUserdata !== undefined) {
        const { user, success, message, status_code } = this.props.responseUserdata;
        if (status_code == 200 && success == true) {
          AsyncStorage.setItem(prefEnum.TAG_USER, JSON.stringify(user));
          this.doFinish("Home", "login");
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            this.clearUserData();
            this.props.navigation.navigate("AuthLoading");
          } else if (status_code == 500) {
            showErrorMessage(strings.somethingWrong);
          } else {
          }
        }
      }
    }

    if (prevProps.responseRefreshTokendata !== this.props.responseRefreshTokendata) {
      if (this.props.responseRefreshTokendata !== undefined) {
        const { success, token, message, status_code } = this.props.responseRefreshTokendata;
        if (status_code == 200 && success == true) {
          AsyncStorage.setItem(prefEnum.TAG_API_TOKEN, token);
          globals.access_token = token;
          this.props.doGetUser();
        } else if (success == false) {
          if (status_code == 500) {
            showErrorMessage(strings.somethingWrong);
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            this.clearUserData();
            this.props.navigation.navigate("AuthLoading");
          } else {
          }
        }
      }
    }
  };

  componentDidMount() {
    // used as navigation event
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.clearStates();
    });
    this.getToken();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getToken() {
    let fcmToken = await messaging().getToken();
    this.setState({ fcmToken: fcmToken });
  }

  onBuffer() {}

  videoError() {}

  doFinish = (routeName, from) => {
    let resetAction = CommonActions.reset({
      index: 0,
      key: null,
      routes: [{ name: routeName, params: { from: from } }],
    });
    this.props.navigation.dispatch(resetAction);
  };

  clearUserData = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === "android") {
        AsyncStorage.clear();
      }
      if (Platform.OS === "ios") {
        AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
  };

  // clear all states after leave this screen
  clearStates() {
    this.setState({
      isHidePassword: true,
      mobilenum: "",
      password: "",
      errMobile: "",
      errPassword: "",
    });
  }

  doClickForgot = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  doClickRegister = () => {
    this.props.navigation.navigate("NewAccount");
  };

  doClickLogin = async () => {
    const { mobilenum, password } = this.state;
    if (globals.isInternetConnected == true) {
      if (mobilenum.trim() === "") {
        this.setState({ errMobile: errors.enter_mobile }, () => {
          this.mobileRef.focus();
        });
        return;
      }
      if (mobilenum.length < 10) {
        this.setState({ errMobile: errors.enter_valid_mobile }, () => {
          showErrorMessage(errors.enter_valid_mobile);
          this.mobileRef.focus();
        });
        return;
      }
      // if (numbercheck(mobilenum)) {
      //   this.setState({ errMobile: errors.enter_valid_mobile }, () => {
      //     this.mobileRef.focus();
      //   });
      //   return;
      // }
      if (password.trim() === "") {
        this.setState({ errPassword: errors.enter_password }, () => {
          this.passwordRef.focus();
        });
        return;
      }
      if (!isPassword(password)) {
        this.setState({ errPassword: errors.passwordValid }, () => {
          this.passwordRef.focus();
        });
        return;
      }
      Keyboard.dismiss();
      const params = {
        phone: mobilenum,
        password: password,
        device_id: DeviceInfo.getDeviceId(),
        device_type: Platform.OS,
        device_token: this.state.fcmToken,
      };
      this.props.doLogin(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  render() {
    const { mobilenum, password, errPassword, isHidePassword, errMobile } = this.state;

    return (
      <SafeAreaView style={AuthStyle.container}>
        <View style={[AuthStyle.viewHeader]}></View>
        <View style={AuthStyle.imglogoContainer}>
          <Video
            source={require("../../components/Animation/logo_ani.mp4")} // Can be a URL or a local file.
            ref={(ref) => {
              logoRef = ref;
            }} // Store reference
            onBuffer={this.onBuffer} // Callback when remote video is buffering
            onError={this.videoError} // Callback when video cannot be loaded
            style={AuthStyle.imglogo}
            repeat={true}
            hideShutterView={true}
            muted={true}
            resize={"cover"}
          />
        </View>

        <KeyboardAwareScrollView
          style={[AuthStyle.scrollViewStyle]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={AuthStyle.scrollContentStyle}
        >
          <View style={AuthStyle.titleviewStyle}>
            <Text style={[AuthStyle.titleText]}>{strings.letsSignIn}</Text>

            <Text style={[AuthStyle.smalltitleText]}>{strings.loginText}</Text>
          </View>
          <View style={[AuthStyle.usernameView, errMobile !== "" ? AuthStyle.errorStyle : AuthStyle.noErrorStyle]}>
            <Image
              source={images.call_img}
              style={{
                width: wp(6),
                height: wp(6),
                alignSelf: "center",
                marginLeft: wp(4),
              }}
            />
            <TextInput
              value={mobilenum}
              ref={(ref) => (this.mobileRef = ref)}
              style={AuthStyle.textInputStyle}
              blurOnSubmit={false}
              autoCapitalize={"none"}
              onChangeText={(text) => {
                this.setState({
                  mobilenum: text,
                  errMobile:
                    text.trim() === ""
                      ? errors.enter_mobile
                      : !isValidMobile(text.trim())
                      ? errors.enter_valid_mobile
                      : "",
                });
              }}
              maxLength={10}
              keyboardType="phone-pad"
              placeholder="Cell number"
              placeholderTextColor={Colors.GREY}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.passwordRef.focus();
              }}
            />
          </View>

          <View style={[AuthStyle.usernameView, errPassword !== "" ? AuthStyle.errorStyle : AuthStyle.noErrorStyle]}>
            <Image
              source={images.lock_img}
              style={{
                width: wp(6),
                height: wp(6),
                alignSelf: "center",
                marginLeft: wp(4),
              }}
            />
            <TextInput
              value={password}
              ref={(ref) => (this.passwordRef = ref)}
              style={AuthStyle.textInputStyle}
              secureTextEntry={isHidePassword}
              blurOnSubmit={false}
              autoCapitalize={"none"}
              onChangeText={(text) => {
                this.setState({
                  password: text,
                  errPassword: text.trim() === "" ? errors.enter_password : "",
                });
              }}
              placeholderTextColor={Colors.GREY}
              returnKeyType="done"
              placeholder="Password"
              onSubmitEditing={() => {
                this.passwordRef.blur();
              }}
            />
            <View style={AuthStyle.hideShowView}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isHidePassword: !isHidePassword,
                  });
                }}
              >
                <Image
                  source={isHidePassword ? images.eye_hide_img : images.eye_show_img}
                  style={{
                    width: wp(6),
                    height: wp(6),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          {errPassword.trim() !== "" && (
            <View style={AuthStyle.errorView}>
              <Image source={images.alert_img} style={{ width: wp(5), height: wp(5), marginRight: wp(1) }} />
              <Text style={AuthStyle.txtError}>{errPassword}</Text>
            </View>
          )}
          <View style={[AuthStyle.forgotPasswordContainer]}>
            <TouchableOpacity onPress={() => this.doClickForgot()}>
              <Text style={[AuthStyle.txtForgotPassword, { color: Colors.PRIMARY }]}>
                {strings.header_forgot_password}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={AuthStyle.loginView}>
            <TouchableOpacity onPress={() => this.doClickLogin()}>
              <BackgroundButton
                title={strings.btn_login}
                backgroundColor={Colors.PRIMARY}
                borderRadius={14}
                textColor={Colors.WHITE}
                fontFamily={font_type.FontSemiBold}
                fontSize={RFPercentage(2.5)}
                height={hp(7)}
                width={wp(90)}
              />
            </TouchableOpacity>
          </View>
          <View style={AuthStyle.txtForgotpassview}>
            <Text style={[AuthStyle.alreadyAccounttxt]}>{strings.noacount}</Text>

            <TouchableOpacity onPress={() => this.doClickRegister()}>
              <Text style={[AuthStyle.alreadyAccounttxtLink]}>{strings.signup}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {this.props.isBusyLogin || this.props.isBusyUserdata ? <Loader /> : null}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyUserdata: state.auth.isBusyUserdata,
    isBusyLogin: state.auth.isBusyLogin,
    responseUserdata: state.auth.responseUserdata,
    currentUser: state.auth.currentUser,
    responseLogin: state.auth.responseLogin,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ doLogin, doRefreshToken, doGetUser }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
