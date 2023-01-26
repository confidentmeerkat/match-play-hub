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
  SafeAreaView,
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
  showSuccessMessage,
  showErrorMessage,
  isValidMobile,
} from "../../utils/helpers";
import font_type from "../../resources/fonts";
import Loader from "../../components/loaders/Loader";
import { doSendOTP } from "../../redux/actions/AuthActions";
import TextTicker from "react-native-text-ticker";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as globals from "../../utils/Globals";
import { CommonActions } from "@react-navigation/native";
import Video from "react-native-video";

let logoRef = React.createRef();
class NewAccountScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidePassword: true,
      mobilenum: "",
      otp: "",
      old_otp: "",
      errMobile: "",
      errOTP: "",
      countryCode: "",
      country_code: "",
      isShowCountry: false,
      countryName: "",
      fcmToken: "",
      isOnlyNumber: false,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseSendOTPdata !== this.props.responseSendOTPdata) {
      if (this.props.responseSendOTPdata !== undefined) {
        const { data, success, message, error, status_code } =
          this.props.responseSendOTPdata;

        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          if (data) {
            this.setState({ isOnlyNumber: true, old_otp: data.otp });
          }
        } else {
          if (error) {
            if (error.country_code) {
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
  }

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
      otp: "",
      errMobile: "",
      errOTP: "",
    });
  }

  doClickForgot = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  doClickLogin = () => {
    this.props.navigation.navigate("Login");
  };

  doClicVerifyOTP = async () => {
    const { otp, old_otp } = this.state;
    if (old_otp == otp) {
      showSuccessMessage("OTP Verified Successfully.");
      this.props.navigation.navigate("Register", {
        phoneNum: this.state.mobilenum,
      });
    } else {
      showErrorMessage("OTP Does not match.");
      this.setState({ otp: "" });
    }
  };

  doClickGetOTP = async () => {
    const { mobilenum } = this.state;

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
      Keyboard.dismiss();
      const params = {
        phone: mobilenum,
        country_code: "+1",
      };
      this.props.doSendOTP(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  doSignUpWithDiffNum = () => {
    this.setState({
      mobilenum: "",
      otp: "",
      isOnlyNumber: false,
    });
  };

  onBuffer() {}

  videoError() {}

  render() {
    const {
      mobilenum,
      otp,
      errOTP,
      isHidePassword,
      errMobile,
      isShowCountry,
      countryCode,
      country_code,
      isOnlyNumber,
    } = this.state;
    return (
      <SafeAreaView style={AuthStyle.container}>
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
            <Text style={[AuthStyle.titleText, {}]}>{strings.newAccount}</Text>
            <Text style={[AuthStyle.smalltitleText]}>
              {strings.loginText}
            </Text>
          </View>

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
                this.optRef.focus();
              }}
            /> */}
          {/* </View> */}

          <View
            style={[
              AuthStyle.usernameView,
              errMobile !== "" ? AuthStyle.errorStyle : AuthStyle.noErrorStyle,
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
            {isOnlyNumber == true ? (
              <Text style={AuthStyle.textInputStyle}>{mobilenum}</Text>
            ) : (
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
                placeholder="Phone number"
                placeholderTextColor={Colors.GREY}
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.mobileRef.blur();
                }}
              />
            )}
          </View>
          {errMobile.trim() !== "" ||
          mobilenum.trim() === "" ||
          isOnlyNumber == false ? (
            <View style={AuthStyle.errorView}>
              <Image
                source={images.alert_img}
                style={{ width: wp(5), height: wp(5), marginRight: wp(1) }}
              />
              <Text style={[AuthStyle.txtError, { width: "90%" }]}>
                {strings.otpverification}
              </Text>
            </View>
          ) : null}

          {isOnlyNumber == true ? (
            <>
              <View
                style={[
                  AuthStyle.usernameView,
                  errOTP !== "" ? AuthStyle.errorStyle : AuthStyle.noErrorStyle,
                ]}
              >
                <Image
                  source={images.otpview_img}
                  style={{
                    width: wp(6),
                    height: wp(6),
                    alignSelf: "center",
                    marginLeft: wp(4),
                  }}
                />
                <TextInput
                  value={otp}
                  ref={(ref) => (this.optRef = ref)}
                  style={AuthStyle.textInputStyle}
                  secureTextEntry={isHidePassword}
                  blurOnSubmit={false}
                  autoCapitalize={"none"}
                  onChangeText={(text) => {
                    this.setState({
                      otp: text,
                      errOTP: text.trim() === "" ? errors.enter_otp : "",
                    });
                  }}
                  maxLength={6}
                  placeholderTextColor={Colors.GREY}
                  returnKeyType="done"
                  placeholder="Enter OTP"
                  keyboardType="phone-pad"
                  onSubmitEditing={() => {
                    this.optRef.blur();
                  }}
                />
              </View>
              {errOTP.trim() !== "" && (
                <View style={AuthStyle.errorView}>
                  <Image
                    source={images.alert_img}
                    style={{ width: wp(5), height: wp(5), marginRight: wp(1) }}
                  />
                  <Text style={AuthStyle.txtError}>{errOTP}</Text>
                </View>
              )}
            </>
          ) : null}
          {mobilenum.trim() === "" ? null : (
            <View style={[AuthStyle.forgotPasswordContainer]}>
              <TouchableOpacity onPress={() => this.doSignUpWithDiffNum()}>
                <Text
                  style={[
                    AuthStyle.txtForgotPassword,
                    { color: Colors.PRIMARY },
                  ]}
                >
                  {strings.changeAccNum}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={AuthStyle.loginView}>
            <TouchableOpacity
              onPress={
                isOnlyNumber == true
                  ? this.doClicVerifyOTP.bind(this)
                  : this.doClickGetOTP.bind(this)
              }
            >
              <BackgroundButton
                title={isOnlyNumber == true ? strings.next : strings.continue}
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
        {this.props.isBusyVerifyOTP || this.props.isBusySendOTP ? (
          <Loader />
        ) : null}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyVerifyOTP: state.auth.isBusyVerifyOTP,
    isBusySendOTP: state.auth.isBusySendOTP,
    responseSendOTPdata: state.auth.responseSendOTPdata,
    responseVerifyOTPdata: state.auth.responseVerifyOTPdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ doSendOTP }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAccountScreen);
