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
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import font_type from "../../resources/fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "../../constants/Colors";
import images from "../../resources/images";
import BackgroundButton from "../../components/buttons/BackgroundButton";
import { AuthStyle } from "../../../assets/styles/AuthStyle";
import strings from "../../resources/languages/strings";
import errors from "../../resources/languages/errors";
import Loader from "../../components/loaders/Loader";
import {
  doForgotPassword,
  doUpdatePassword,
} from "../../redux/actions/AuthActions";
import {
  isPassword,
  showSuccessMessage,
  numbercheck,
  showErrorMessage,
  isValidMobile,
} from "../../utils/helpers";

import Video from "react-native-video";
import * as globals from "../../utils/Globals";

let logoRef = React.createRef();
class ForgotPasswordScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      password: "",
      errPassword: "",
      errOtp: "",
      countryCode: "",
      country_code: "",
      isShowCountry: false,
      isShowOTPView: false,
      mobilenum: "",
      errMobile: "",
      isHidePassword: true,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseForgotPassdata !== this.props.responseForgotPassdata
    ) {
      if (this.props.responseForgotPassdata !== undefined) {
        const { success, message, error, status_code } =
          this.props.responseForgotPassdata;

        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.setState({ isShowOTPView: true });
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

    if (prevProps.responseUpdatedata !== this.props.responseUpdatedata) {
      if (this.props.responseUpdatedata !== undefined) {
        const { success, message, status_code } = this.props.responseUpdatedata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.props.navigation.navigate("Login");
        } else {
          showErrorMessage(message);
        }
      }
    }
  }

  componentDidMount() {
    // used as navigation event
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.clearStates();
    });
    
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  // clear all states after leave this screen
  clearStates() {
    this.setState({
      otp: "",
      password: "",
      errPassword: "",
      errOtp: "",
      countryCode: "",
      country_code: "",
      isShowCountry: false,
      isShowOTPView: false,
      mobilenum: "",
      errMobile: "",
      isHidePassword: true,
    });
  }

  doClickLogin() {
    this.props.navigation.navigate("Login");
  }

  doClickDownArrow = () => {
    this.setState({ isShowCountry: true });
  };

  onSelect = (country) => {
    this.setState({
      countryCode: country.cca2,
      country_code: country.callingCode[0],
    });
  };

  async doClickUpdate() {
    const { mobilenum, otp, country_code, password } = this.state;
    if (globals.isInternetConnected == true) {
      if (mobilenum.trim() === "") {
        this.setState({ errMobile: errors.enter_mobile }, () => {
          this.mobileRef.focus();
        });
        return;
      }
      if (mobilenum.length < 10) {
        this.setState({ errMobile: errors.enter_mobile }, () => {
          this.mobileRef.focus();
        });
        return;
      }
      if (numbercheck(mobilenum)) {
        this.setState({ errMobile: errors.enter_mobile }, () => {
          this.mobileRef.focus();
        });
        return;
      }
      // if (country_code.trim() === "") {
      //   showErrorMessage(errors.pls_select_country);
      //   return;
      // }
      if (otp.trim() === "") {
        showErrorMessage(errors.enter_otp);
        return;
      }
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
      const params = {
        phone: mobilenum,
        otp: otp,
        password: password,
      };
      this.props.doUpdatePassword(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  }

  async doClickSubmit() {
    const { mobilenum, country_code, password } = this.state;
    if (globals.isInternetConnected == true) {
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

      Keyboard.dismiss();
      const params = {
        phone: mobilenum,
        country_code: "+1", // country_code
      };
      this.props.doForgotPassword(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  }

  onBuffer() {}

  videoError() {}

  render() {
    const {
      otp,
      errMobile,
      errOtp,
      mobilenum,
      isShowCountry,
      countryCode,
      country_code,
      password,
      isHidePassword,
      isShowOTPView,
      errPassword,
    } = this.state;

    return (
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
            <Text style={[AuthStyle.titleText]}>
              {strings.header_forgot_password}
            </Text>
            {isShowOTPView ? (
              <Text numberOfLines={2} style={[AuthStyle.smalltitleText]}>
                {strings.checkotp}
              </Text>
            ) : null}
          </View>

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
              returnKeyType="done"
              onSubmitEditing={() => {
                this.mobileRef.blur();
              }}
            />
          </View>

          <View style={AuthStyle.errorView}>
            <Image
              source={images.alert_img}
              style={{ width: wp(5), height: wp(5), marginRight: wp(1) }}
            />
            <Text style={[AuthStyle.txtError, { width: "90%" }]}>
              {strings.otpverification}
            </Text>
          </View>

          {/* <View
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
            <View style={AuthStyle.countryPickerView}>
              <CountryPicker
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
              />
              <Image
                source={images.country_US_img}
                style={AuthStyle.country_img}
              />
              <TouchableOpacity onPress={this.doClickDownArrow.bind(this)}>
                <Image
                  source={images.down_arrow_img}
                  style={AuthStyle.downIcon}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={AuthStyle.textInputCountryCode}
              editable={false}
              blurOnSubmit={false}
              value={`+${1}`}
            />
            <TextInput
              ref={(ref) => (this.mobileRef = ref)}
              style={AuthStyle.textInputStyle}
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
              placeholder="Phone number"
              keyboardType="phone-pad"
              placeholderTextColor={Colors.GREY}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.mobileRef.blur();
              }}
            />
          </View> */}

          {isShowOTPView ? (
            <>
              <View
                style={[
                  AuthStyle.usernameView,
                  errOtp !== "" ? AuthStyle.errorStyle : AuthStyle.noErrorStyle,
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
                  ref={(ref) => (this.otpRef = ref)}
                  style={AuthStyle.textInputStyle}
                  blurOnSubmit={false}
                  autoCapitalize={"none"}
                  onChangeText={(text) => {
                    this.setState({
                      otp: text,
                      errOtp: text.trim() === "" ? errors.enter_mobile : "",
                    });
                  }}
                  maxLength={6}
                  keyboardType="phone-pad"
                  placeholder="Enter Code"
                  placeholderTextColor={Colors.GREY}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.otpRef.blur();
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
                        isHidePassword
                          ? images.eye_hide_img
                          : images.eye_show_img
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
            </>
          ) : null}

          <View style={[AuthStyle.forgotPasswordContainer]}>
            <TouchableOpacity onPress={() => this.doClickLogin()}>
              <Text
                style={[AuthStyle.txtForgotPassword, { color: Colors.PRIMARY }]}
              >
                {strings.backtologin}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={AuthStyle.loginView}>
            <TouchableOpacity
              onPress={
                isShowOTPView
                  ? this.doClickUpdate.bind(this)
                  : this.doClickSubmit.bind(this)
              }
            >
              <BackgroundButton
                title={isShowOTPView ? strings.update : strings.submit}
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
        </KeyboardAwareScrollView>
        {this.props.isBusyUpdate || this.props.isBusyForgotPass ? (
          <Loader />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyForgotPass: state.auth.isBusyForgotPass,
    isBusyUpdate: state.auth.isBusyUpdate,
    responseForgotPassdata: state.auth.responseForgotPassdata,
    responseUpdatedata: state.auth.responseUpdatedata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ doForgotPassword, doUpdatePassword }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordScreen);
