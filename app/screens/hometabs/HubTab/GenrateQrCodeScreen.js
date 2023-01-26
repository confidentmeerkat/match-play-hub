import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import Header from "../../../components/Header/Header";
import QRCode from "react-native-qrcode-svg";
import strings from "../../../resources/languages/strings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../resources/constants";
import * as globals from "../../../utils/Globals";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";

class GenrateQrCodeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qr_url: props.route.params.qr_url,
      username: "",
      currentUser: {},
    };
  }

  componentDidMount() {
    this.getApiToken();
    if (this.props.currentUser !== undefined) {
      this.setState({ currentUser: this.props.currentUser }, () => {
        this.setUserInfo();
      });
    }
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  setUserInfo = () => {
    const { currentUser } = this.state;

    this.setState({
      username: currentUser.username,
    });
  };

  render() {
    const { qr_url, username } = this.state;
    return (
      <View style={[ProfileStyle.container]}>
        <Header isHideBack  props={this.props} />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={ProfileStyle.squareviewofQr}>
            <Text style={[ProfileStyle.headertext, { marginBottom: hp(2) }]}>
              {username ? username : ""}
            </Text>
            <QRCode size={220} value={qr_url} />
          </View>
          <Text numberOfLines={4} style={ProfileStyle.qrText}>
            {strings.qrCode}
          </Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenrateQrCodeScreen);
