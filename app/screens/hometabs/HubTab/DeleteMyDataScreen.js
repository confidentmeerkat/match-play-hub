import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, Alert, Platform, View, TouchableOpacity } from "react-native";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import Header from "../../../components/Header/Header";
import strings from "../../../resources/languages/strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { prefEnum } from "../../../resources/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthStyle } from "../../../../assets/styles/AuthStyle";
import { RFPercentage } from "react-native-responsive-fontsize";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import Colors from "../../../constants/Colors";
import BackgroundButton from "../../../components/buttons/BackgroundButton";
import font_type from "../../../resources/fonts";
import { bindActionCreators } from "redux";
import Loader from "../../../components/loaders/Loader";
import { doDeleteAccount } from "../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { showErrorMessage, showSuccessMessage } from "../../../utils/helpers";
import errors from "../../../resources/languages/errors";
import * as globals from "../../../utils/Globals";

class DeleteMyDataScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  async componentDidUpdate(prevProps) {
    if (
      prevProps.responseDeleteAccountdata !==
      this.props.responseDeleteAccountdata
    ) {
      if (this.props.responseDeleteAccountdata !== undefined) {
        const { success, message, status_code } =
          this.props.responseDeleteAccountdata;
        
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          await this.clearUserData();
          this.props.navigation.navigate("AuthLoading");
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

  componentDidMount() {}

  componentWillUnmount() {}

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

  doClickDeleteAccount = () => {
    Alert.alert(
      strings.dialog_title_confirm_delete,
      strings.dialog_message_confirm_delete,
      [
        {
          text: strings.btn_no,
        },
        {
          text: strings.btn_yes,
          onPress: () => {
            this.deletemyAccountAPI();
          },
        },
      ],
      { cancelable: false }
    );
  };

  deletemyAccountAPI = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doDeleteAccount();
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  render() {
    return (
      <View style={[ProfileStyle.container]}>
        <Header isHideBack props={this.props} headerText={"Delete Account"} />
        <View style={TabStyle.marginfromallside}>
          <Text style={[TabStyle.deleteAccText]}>{strings.deldataString}</Text>
        </View>
        <View style={AuthStyle.loginView}>
          <TouchableOpacity onPress={() => this.doClickDeleteAccount()}>
            <BackgroundButton
              title={strings.deletestring}
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
        {this.props.isBusyDeleteAccount ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    isBusyDeleteAccount: state.app.isBusyDeleteAccount,
    responseDeleteAccountdata: state.app.responseDeleteAccountdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ doRefreshToken, doDeleteAccount }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMyDataScreen);
