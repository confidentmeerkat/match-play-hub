import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  Text,
  View,
  Image,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constants/Colors";
import images from "../../resources/images";
import BackgroundButton from "../../components/buttons/BackgroundButton";
import { AuthStyle } from "../../../assets/styles/AuthStyle";
import strings from "../../resources/languages/strings";
import errors from "../../resources/languages/errors";
import {
  isName,
  isPassword,
  showSuccessMessage,
  showErrorMessage,
  isValidMobile,
  isUsername,
} from "../../utils/helpers";
import font_type from "../../resources/fonts";
import Loader from "../../components/loaders/Loader";
import {
  doRegister,
  doRefreshToken,
  doGetUser,
} from "../../redux/actions/AuthActions";
import FastImage from "react-native-fast-image";
import TextTicker from "react-native-text-ticker";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import * as globals from "../../utils/Globals";
import { CommonActions } from "@react-navigation/native";
import MediaModel from "../../components/modals/MediaModel";
import { ProfileStyle } from "../../../assets/styles/ProfileStyle";
import Video from "react-native-video";

let logoRef = React.createRef();
class RegisterScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidePassword: true,
      mobilenum: props.route.params.phoneNum,
      username: "",
      password: "",
      errMobile: "",
      errPassword: "",
      errUsername: "",
      isticktermcondition: false,
      isTermandConditionPicker: false,
      countryCode: "",
      country_code: "",
      isShowCountry: false,
      countryName: "",
      fcmToken: "",
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseRegister !== this.props.responseRegister) {
      if (this.props.responseRegister !== undefined) {
        const {  token, success, message, error, status_code } =
          this.props.responseRegister;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          AsyncStorage.setItem(prefEnum.TAG_API_TOKEN, token);
          globals.access_token = token;
          this.props.doGetUser();
        } else {
          if (error) {
            if (error.username) {
              showErrorMessage(error.username);
            } else if (error.country_code) {
              showErrorMessage(error.country_code);
            } else if (error.phone) {
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
        const { user, success, message, status_code } =
          this.props.responseUserdata;
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

    if (
      prevProps.responseRefreshTokendata !== this.props.responseRefreshTokendata
    ) {
      if (this.props.responseRefreshTokendata !== undefined) {
        const { success, token, message, status_code } =
          this.props.responseRefreshTokendata;
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
  }

  componentDidMount() {
    this.getToken();
  }

  componentWillUnmount() {}

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

  doClickDownArrow = () => {
    this.setState({ isShowCountry: true });
  };

  async getToken() {
    let fcmToken = await messaging().getToken();
    this.setState({ fcmToken: fcmToken });
  }

  onSelect = (country) => {
    this.setState({
      countryName: country.name,
      countryCode: country.cca2,
      country_code: country.callingCode[0],
    });
  };

  // clear all states after leave this screen
  clearStates() {
    this.setState({
      isHidePassword: true,
      mobilenum: "",
      password: "",
      errMobile: "",
      errPassword: "",
      errUsername: "",
      username: "",
    });
  }

  doClickForgot = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  doClickLogin = () => {
    this.props.navigation.navigate("Login");
  };

  doClickTermandCondition = () => {
    this.setState({ isticktermcondition: !this.state.isticktermcondition });
  };

  doClickSignup = async () => {
    const {
      mobilenum,
      countryName,
      password,
      username,
      isticktermcondition,
      country_code,
    } = this.state;

    if (globals.isInternetConnected == true) {
      if (username.trim() === "") {
        this.setState({ errUsername: errors.enter_username }, () => {
          this.usernameRef.focus();
        });
        return;
      }
      if (!isName(username)) {
        this.setState({ errUsername: errors.emailvalidLength }, () => {
          this.usernameRef.focus();
        });
        return;
      }
      if (!isUsername(username)) {
        this.setState({ errUsername: errors.validusername }, () => {
          this.usernameRef.focus();
        });
        // showErrorMessage(errors.validusername);
        return;
      }

      // if (country_code.trim() === "") {
      //   showErrorMessage(errors.pls_select_country);
      //   return;
      // }
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
      //   this.setState({ errMobile: errors.enter_mobile }, () => {
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
      if (isticktermcondition == false) {
        showErrorMessage(errors.plschecktermandcondition);
        return;
      }
      Keyboard.dismiss();
      const params = {
        username: username,
        phone: mobilenum,
        password: password,
        country_code: "+1", // country_code
        country_name: "United States", // countryName,
        device_id: DeviceInfo.getDeviceId(),
        device_type: Platform.OS,
        device_token: this.state.fcmToken,
      };
      this.props.doRegister(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  //display gallry picker model
  TermandConditionPicker = () => {
    // this.setState({
    //   isTermandConditionPicker: !this.state.isTermandConditionPicker,
    // });
    this.props.navigation.navigate("TermAndCondition");
  };

  onBuffer() {}

  videoError() {}

  render() {
    const {
      mobilenum,
      username,
      password,
      errPassword,
      isHidePassword,
      errMobile,
      errUsername,
      isticktermcondition,
      isShowCountry,
      countryCode,
      country_code,
      isTermandConditionPicker,
    } = this.state;

    return (
      <>
        <View>
          <MediaModel
            modalVisible={isTermandConditionPicker}
            onBackdropPress={() => this.TermandConditionPicker()}
          >
            <View style={ProfileStyle.modelContainer}>
              <View style={[ProfileStyle.modelView]}>
                <View style={ProfileStyle.titleviewstyle}>
                  <Text style={[ProfileStyle.textStylePopup]}>
                    {
                      "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Why do we use it?It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
                    }
                  </Text>
                </View>
              </View>
            </View>
          </MediaModel>
        </View>
        <View style={AuthStyle.container}>
          <View style={AuthStyle.viewHeader}></View>
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
            />
          </View>
          <KeyboardAwareScrollView
            style={AuthStyle.scrollViewStyle}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={AuthStyle.scrollContentStyle}
          >
            <View style={AuthStyle.titleviewStyle}>
              <Text style={[AuthStyle.titleText]}>{strings.started}</Text>
              <TextTicker
                style={[AuthStyle.smalltitleText]}
                duration={3000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {strings.loginText}
              </TextTicker>
            </View>
            <View
              style={[
                AuthStyle.usernameView,
                errUsername !== ""
                  ? AuthStyle.errorStyle
                  : AuthStyle.noErrorStyle,
              ]}
            >
              <Image
                source={images.user_img}
                style={{
                  width: wp(6),
                  height: wp(6),
                  alignSelf: "center",
                  marginLeft: wp(4),
                }}
              />
              <TextInput
                value={username}
                ref={(ref) => (this.usernameRef = ref)}
                style={AuthStyle.textInputStyle}
                blurOnSubmit={false}
                // autoCapitalize={"words"}
                onChangeText={(text) => {
                  this.setState({
                    username: text,
                    errUsername:
                      text.trim() === "" ? errors.enter_username : "",
                  });
                }}
                placeholderTextColor={Colors.GREY}
                returnKeyType="next"
                placeholder="Username"
                onSubmitEditing={() => {
                  this.mobileRef.focus();
                }}
              />
            </View>
            {errUsername.trim() !== "" && (
              <View style={AuthStyle.errorView}>
                <Image
                  source={images.alert_img}
                  style={{ width: wp(5), height: wp(5), marginRight: wp(1) }}
                />
                <Text style={AuthStyle.txtError}>{errUsername}</Text>
              </View>
            )}

            {/* <View
            style={[
              AuthStyle.usernameView,
              errMobile !== "" ? AuthStyle.errorStyle : AuthStyle.noErrorStyle,
            ]}
          > */}
            {/* <Image
              source={images.call_img}
              style={{
                width: wp(6),
                height: wp(6),
                alignSelf: "center",
                marginLeft: wp(4),
              }}
            /> */}
            {/* <View style={AuthStyle.countryPickerView}> */}
            {/* <CountryPicker
                visible={isShowCountry}
                withCloseButton={true}
                placeholder={"Country"}
                placeholderTextColor={Colors.GREY}
                withFlag={true}
                withFlagButton={true}
                withCallingCode={true}
                withAlphaFilter={true}
                withCallingCodeButton={false}
                withFilter={true}
                withModal={true}
                onSelect={this.onSelect.bind(this)}
                countryCode={countryCode}
              /> */}
            {/* <Image
                source={images.country_US_img}
                style={AuthStyle.country_img}
              /> */}

            {/* <TouchableOpacity onPress={this.doClickDownArrow.bind(this)}>
                <Image
                  source={images.down_arrow_img}
                  style={AuthStyle.downIcon}
                />
              </TouchableOpacity> */}
            {/* </View> */}
            {/* <TextInput
              style={AuthStyle.textInputCountryCode}
              editable={false}
              blurOnSubmit={false}
              value={`+${1}`}
            />
            <TextInput
              ref={(ref) => (this.mobileRef = ref)}
              style={[AuthStyle.textInputStyle]}
              blurOnSubmit={false}
              autoCapitalize={"none"}
              value={mobilenum}
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
              placeholder="Phone number"
              placeholderTextColor={Colors.GREY}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.passwordRef.focus();
              }}
            /> */}
            {/* </View> */}

            <View
              style={[
                AuthStyle.usernameView,
                errMobile !== ""
                  ? AuthStyle.errorStyle
                  : AuthStyle.noErrorStyle,
              ]}
            >
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

            <View
              style={[
                AuthStyle.usernameView,
                errPassword !== ""
                  ? AuthStyle.errorStyle
                  : AuthStyle.noErrorStyle,
              ]}
            >
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
                    errPassword:
                      text.trim() === "" ? errors.enter_password : "",
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
                    source={
                      isHidePassword ? images.eye_hide_img : images.eye_show_img
                    }
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
                <Image
                  source={images.alert_img}
                  style={{ width: wp(5), height: wp(5), marginRight: wp(1) }}
                />
                <Text style={AuthStyle.txtError}>{errPassword}</Text>
              </View>
            )}

            <View style={AuthStyle.termandconditionview}>
              <TouchableOpacity
                onPress={() => this.doClickTermandCondition()}
                style={[AuthStyle.squareView]}
              >
                {isticktermcondition == true ? (
                  <FastImage
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: Colors.PRIMARY,
                    }}
                    source={images.rightsign_img}
                    resizeMode={FastImage.resizeMode.contain}
                  ></FastImage>
                ) : null}
              </TouchableOpacity>
              <Text
                style={[AuthStyle.alreadyAccounttxt, { marginLeft: wp(2) }]}
              >
                {strings.termandcondition}
                <TouchableOpacity onPress={() => this.TermandConditionPicker()}>
                  <Text
                    style={[
                      AuthStyle.alreadyAccounttxtLink,
                      { marginLeft: wp(0) },
                    ]}
                  >
                    {strings.termandconditionurl}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>

            <View style={AuthStyle.loginView}>
              <TouchableOpacity onPress={() => this.doClickSignup()}>
                <BackgroundButton
                  title={strings.signup}
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
              <Text style={[AuthStyle.alreadyAccounttxt]}>
                {strings.i_have_already}
              </Text>

              <TouchableOpacity onPress={() => this.doClickLogin()}>
                <Text style={[AuthStyle.alreadyAccounttxtLink]}>
                  {strings.signin}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
          {this.props.isBusyRegister || this.props.isBusyUserdata ? (
            <Loader />
          ) : null}
        </View>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyRegister: state.auth.isBusyRegister,
    responseRegister: state.auth.responseRegister,
    isBusyUserdata: state.auth.isBusyUserdata,
    responseUserdata: state.auth.responseUserdata,
    currentUser: state.auth.currentUser,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ doRegister, doRefreshToken, doGetUser }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
