import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, TouchableOpacity, FlatList, View, Platform } from "react-native";
import { TabCommonStyle } from "../../../assets/styles/TabCommonStyle";
import strings from "../../resources/languages/strings";
import images from "../../resources/images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import errors from "../../resources/languages/errors";
import { showSuccessMessage, showErrorMessage } from "../../utils/helpers";
import { doRefreshToken } from "../../redux/actions/AuthActions";
import { doGetBlockedChatList } from "../../redux/actions/ChatActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import Loader from "../../components/loaders/Loader";
import * as globals from "../../utils/Globals";
import { TabStyle } from "../../../assets/styles/TabStyle";
import Header from "../../components/Header/Header";
import SwitchComponent from "../../components/Switch/SwitchComponent";
import { Settingstyle } from "../../../assets/styles/Settingstyle";
import { EventRegister } from "react-native-event-listeners";

class ChatSearchFilterScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowBlockedChat: false,
      blockedchatlist: [],
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseGetBlockedChatlist !==
      this.props.responseGetBlockedChatlist
    ) {
      if (this.props.responseGetBlockedChatlist !== undefined) {
        const { success, message, status_code, usersMessage } =
          this.props.responseGetBlockedChatlist;
        if (status_code == 200 && success == true) {
          this.setBlockedChatData(usersMessage);
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === "android") {
                AsyncStorage.clear();
              }
              if (Platform.OS === "ios") {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
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
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === "android") {
                AsyncStorage.clear();
              }
              if (Platform.OS === "ios") {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
            this.props.navigation.navigate("AuthLoading");
          } else {
          }
        }
      }
    }
  }

  componentDidMount = async () => {
    this.listenerone = EventRegister.addEventListener(
      "RefreshBlockedlist",
      async () => {
        await this.doClickgetBlockChat();
      }
    );
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listenerone);
  }

  changeHidearchiveChat() {
    this.setState(
      {
        isShowBlockedChat: !this.state.isShowBlockedChat,
      },
      () => {
        this.doClickgetBlockChat();
        this.forceUpdate();
      }
    );
  }

  setBlockedChatData = (usersMessage) => {
    this.setState({
      blockedchatlist: usersMessage,
    });
  };

  doClickgetBlockChat = async () => {
    if (globals.isInternetConnected == true) {
      if (this.state.isShowBlockedChat == true) {
        this.props.doGetBlockedChatList();
      } else {
        this.setState({ blockedchatlist: [] });
      }
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoDetailofMessage = (item, index) => {
    this.props.navigation.navigate("ChatDetail", {
      other_user_info_Id: item.id,
      isFrom: "searchblockFilter",
    });
  };

  renderBlockedChatview = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.gotoDetailofMessage(item, index)}
        style={[
          TabStyle.mainBottomFlatView,
          {
            paddingHorizontal: 0,
            marginVertical: 0,
          },
        ]}
      >
        <View style={[TabStyle.FlatinnerView]}>
          <FastImage
            style={TabStyle.userImg}
            source={
              item.profile_url === ""
                ? images.dummy_user_img
                : { uri: item.profile_url }
            }
          ></FastImage>
        </View>
        {item.is_read == "unread" ? (
          <View style={[TabStyle.dotView]}></View>
        ) : (
          <View style={{ marginHorizontal: wp(1) }}></View>
        )}

        <View style={{ marginLeft: wp(3), width: wp(42) }}>
          <Text numberOfLines={1} style={[TabStyle.headertext]}>
            {item.username ? item.username : ""}
          </Text>
          <Text
            numberOfLines={1}
            style={[TabStyle.smalltextview, { width: "85%" }]}
          >
            {item.message ? item.message : ""}
          </Text>
        </View>

        <View>
          <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
            {item.last_time ? item.last_time : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { isShowBlockedChat, blockedchatlist } = this.state;

    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={Settingstyle.subview}>
          <Text style={Settingstyle.subtitleview}>{strings.blockedUser}</Text>
          <View style={Settingstyle.nextview}>
            <SwitchComponent
              value={isShowBlockedChat}
              onValueChange={() => this.changeHidearchiveChat()}
            />
          </View>
        </View>
        {blockedchatlist.length == 0 ? (
          <>
            <View style={TabStyle.emptyview}>
              <Text numberOfLines={2} style={TabStyle.emptytext}>
                {strings.noBlockedChatist}
              </Text>
            </View>
          </>
        ) : (
          <View style={[TabStyle.onlyFlex, TabStyle.dropdownmargins]}>
            <FlatList
              data={blockedchatlist}
              renderItem={({ item, index }) =>
                this.renderBlockedChatview(item, index)
              }
              bounces={false}
              showsVerticalScrollIndicator={false}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            />
          </View>
        )}
        {this.props.isBusyGetBlockedChatlist ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyGetBlockedChatlist: state.chat.isBusyGetBlockedChatlist,
    responseGetBlockedChatlist: state.chat.responseGetBlockedChatlist,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doGetBlockedChatList,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatSearchFilterScreen);
