import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import { prefEnum } from "../../../resources/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundButton from "../../../components/buttons/BackgroundButton";
import { AuthStyle } from "../../../../assets/styles/AuthStyle";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import font_type from "../../../resources/fonts";
import Colors from "../../../constants/Colors";
import images from "../../../resources/images";
import errors from "../../../resources/languages/errors";
import { Settingstyle } from "../../../../assets/styles/Settingstyle";
import Header from "../../../components/Header/Header";
import strings from "../../../resources/languages/strings";
import SwitchComponent from "../../../components/Switch/SwitchComponent";
import FastImage from "react-native-fast-image";
import CountryPicker from "react-native-country-picker-modal";
import Loader from "../../../components/loaders/Loader";
import {
  doGetSettings,
  doStoreSettings,
} from "../../../redux/actions/AppActions";
import {
  doLogoutUser,
  doRefreshToken,
} from "../../../redux/actions/AuthActions";
import * as globals from "../../../utils/Globals";
import { showErrorMessage, showSuccessMessage } from "../../../utils/helpers";
class SettingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHideConnectionNotification: false,
      isHideChatNotification: false,
      isHideMatchUpdateNotification: false,
      isShowCountry: false,
      countryName: "",
      countryCode: "",
      country_code: "",
      currentLanguage: "English",
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  async componentDidUpdate(prevProps) {
    if (prevProps.responseLogoutdata !== this.props.responseLogoutdata) {
      if (this.props.responseLogoutdata !== undefined) {
        const { success, message, status_code } = this.props.responseLogoutdata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          await this.clearUserData();
          this.props.navigation.navigate("AuthLoading");
        } else {
          showErrorMessage(message);
        }
      }
    }

    if (
      prevProps.responseGetSettingsdata !== this.props.responseGetSettingsdata
    ) {
      if (this.props.responseGetSettingsdata !== undefined) {
        const { success, message, userSettingData, status_code } =
          this.props.responseGetSettingsdata;

        if (status_code == 200 && success == true) {
          if (userSettingData == []) {
          } else {
            this.setSettingsData(userSettingData);
          }
        } else if (success == false) {
          showErrorMessage(message);
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
      prevProps.responseStoreSettingsdata !==
      this.props.responseStoreSettingsdata
    ) {
      if (this.props.responseStoreSettingsdata !== undefined) {
        const { success, message, status_code } =
          this.props.responseStoreSettingsdata;

        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.props.navigation.goBack();
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
            showErrorMessage(message);
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
    // used as navigation event
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getApiToken();
      this.getSettings();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  getSettings = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doGetSettings();
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setSettingsData = (userSettingData) => {
    if (userSettingData[0].connectionnotification == "1") {
      this.setState({ isHideConnectionNotification: true });
    }
    if (userSettingData[0].chatnotification == "1") {
      this.setState({ isHideChatNotification: true });
    }
    if (userSettingData[0].updateMatchnotification == "1") {
      this.setState({ isHideMatchUpdateNotification: true });
    }
    this.setState({
      countryName: userSettingData[0].country_name,
      currentLanguage: userSettingData[0].language,
    });
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

  changeHideConnectionNotification() {
    this.setState({
      isHideConnectionNotification: !this.state.isHideConnectionNotification,
    });
  }

  changeHideChatNotification() {
    this.setState({
      isHideChatNotification: !this.state.isHideChatNotification,
    });
  }

  changeHideUpdateMatchNotification() {
    this.setState({
      isHideMatchUpdateNotification: !this.state.isHideMatchUpdateNotification,
    });
  }

  doClickChooseCountry = () => {
    this.setState({ isShowCountry: !this.state.isShowCountry });
  };

  onSelect = (country) => {
    this.setState({
      countryName: country.name,
      countryCode: country.cca2,
      country_code: country.callingCode[0],
    });
  };

  returnCountryPickerView = () => {
    return (
      <CountryPicker
        visible={this.state.isShowCountry}
        placeholder={""}
        withCloseButton={true}
        withFlag={true}
        withFlagButton={true}
        withCallingCode={true}
        withAlphaFilter={true}
        withCallingCodeButton={false}
        withFilter={true}
        withModal={true}
        onSelect={this.onSelect}
        countryCode={this.state.countryCode}
      />
    );
  };

  doClickLogout = () => {
    Alert.alert(
      strings.dialog_title_confirm_logout,
      strings.dialog_message_confirm_logout,
      [
        {
          text: strings.btn_cancel,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: strings.btn_logout,
          onPress: () => {
            this.props.doLogoutUser();
          },
        },
      ],
      { cancelable: false }
    );
  };

  doClickSubmitSettings = async () => {
    const {
      countryName,
      isHideChatNotification,
      isHideMatchUpdateNotification,
      country_code,
      isHideConnectionNotification,
      currentLanguage,
    } = this.state;

    if (globals.isInternetConnected == true) {
      const params = {
        language: currentLanguage,
        connectionnotification:
          isHideConnectionNotification == false ? "0" : "1",
        chatnotification: isHideChatNotification == false ? "0" : "1",
        updateMatchnotification:
          isHideMatchUpdateNotification == false ? "0" : "1",
      };
      this.props.doStoreSettings(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoTermAndCondition = () => {
    this.props.navigation.navigate("PrivacyPolicy");
  };

  gotoDeleteAccount = () => {
    this.props.navigation.navigate("DeleteMyData");
  };

  gotoHelpCenter = () => {
    this.props.navigation.navigate("HelpCenter");
  };

  render() {
    const {
      isHideConnectionNotification,
      isHideChatNotification,
      isHideMatchUpdateNotification,
      currentLanguage,
    } = this.state;

    return (
      <View style={[Settingstyle.container]}>
        <Header isHideBack props={this.props} />
        {/* {this.returnCountryPickerView()} */}
        {/* <View style={Settingstyle.lineViewContainer}></View> */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginBottom: hp(8), marginTop: hp(2) }}
        >
          <View style={Settingstyle.headingview}>
            <Text style={Settingstyle.headertext}>{strings.prefrence}</Text>
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>{strings.country}</Text>

            <Text style={Settingstyle.endtitleview}>
              {/* {countryName ? countryName : ""} */}
              {"United States"}
            </Text>

            {/* <TouchableOpacity
              onPress={this.doClickChooseCountry.bind(this)}
              style={Settingstyle.nextview}
            >
              <FastImage
                style={[Settingstyle.tab_Image]}
                source={images.next_img}
                tintColor={Colors.PRIMARY}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity> */}
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>{strings.language}</Text>
            <Text style={Settingstyle.endtitleview}>
              {currentLanguage ? currentLanguage : ""}
            </Text>

            {/* <TouchableOpacity style={Settingstyle.nextview}>
              <FastImage
                style={[Settingstyle.tab_Image]}
                source={images.next_img}
                tintColor={Colors.PRIMARY}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity> */}
          </View>
          <View style={Settingstyle.lineViewContainer}></View>
          <View style={Settingstyle.headingview}>
            <Text style={Settingstyle.headertext}>
              {strings.application_Settings}
            </Text>
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>
              {strings.connectionnotification}
            </Text>

            <View style={Settingstyle.nextview}>
              <SwitchComponent
                value={isHideConnectionNotification}
                onValueChange={() => this.changeHideConnectionNotification()}
              />
            </View>
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>
              {strings.chatnotification}
            </Text>

            <View style={Settingstyle.nextview}>
              <SwitchComponent
                value={isHideChatNotification}
                onValueChange={() => this.changeHideChatNotification()}
              />
            </View>
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>
              {strings.updatematchnotification}
            </Text>

            <View style={Settingstyle.nextview}>
              <SwitchComponent
                value={isHideMatchUpdateNotification}
                onValueChange={this.changeHideUpdateMatchNotification.bind(
                  this
                )}
              />
            </View>
          </View>
          <View style={Settingstyle.lineViewContainer}></View>
          <View style={Settingstyle.headingview}>
            <Text style={Settingstyle.headertext}>{strings.support}</Text>
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>{strings.help_center}</Text>
            <TouchableOpacity
              onPress={() => this.gotoHelpCenter()}
              style={Settingstyle.nextview}
            >
              <FastImage
                style={[Settingstyle.tab_Image]}
                source={images.next_img}
                tintColor={Colors.PRIMARY}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>
              {strings.privacyPolicy}
            </Text>
            <TouchableOpacity
              onPress={() => this.gotoTermAndCondition()}
              style={Settingstyle.nextview}
            >
              <FastImage
                style={[Settingstyle.tab_Image]}
                source={images.next_img}
                tintColor={Colors.PRIMARY}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </View>
          <View style={Settingstyle.subview}>
            <Text style={Settingstyle.subtitleview}>{strings.deleteData}</Text>
            <TouchableOpacity
              onPress={() => this.gotoDeleteAccount()}
              style={Settingstyle.nextview}
            >
              <FastImage
                style={[Settingstyle.tab_Image]}
                source={images.next_img}
                tintColor={Colors.PRIMARY}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </View>
          <View style={AuthStyle.loginView}>
            <TouchableOpacity onPress={() => this.doClickSubmitSettings()}>
              <BackgroundButton
                title={strings.updateSettings}
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
          <View style={AuthStyle.loginView}>
            <TouchableOpacity onPress={() => this.doClickLogout()}>
              <BackgroundButton
                title={strings.btn_logout}
                backgroundColor={Colors.WHITE}
                backgroundColor={Colors.WHITE}
                borderColor={Colors.GREY}
                borderWidth={0.3}
                borderRadius={14}
                isImage={true}
                btnImage={images.logout_img}
                textColor={Colors.DARK_GREY}
                fontFamily={font_type.FontSemiBold}
                fontSize={RFPercentage(2.5)}
                height={hp(7)}
                width={wp(90)}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.props.isBusyLogout ||
        this.props.isBusyStoreSettings ||
        this.props.isBusyGetSettings ? (
          <Loader />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    responseLogoutdata: state.auth.responseLogoutdata,
    isBusyLogout: state.auth.isBusyLogout,
    responseGetSettingsdata: state.app.responseGetSettingsdata,
    isBusyGetSettings: state.app.isBusyGetSettings,
    responseStoreSettingsdata: state.app.responseStoreSettingsdata,
    isBusyStoreSettings: state.app.isBusyStoreSettings,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doLogoutUser,
        doGetSettings,
        doStoreSettings,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
