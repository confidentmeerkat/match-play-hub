import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  SectionList,
} from "react-native";
import moment from "moment";
import { TabCommonStyle } from "../../../assets/styles/TabCommonStyle";
import Header from "../../components/Header/Header";
import SearchByName from "../../components/Search/SearchByName";
import strings from "../../resources/languages/strings";
import images from "../../resources/images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import Colors from "../../constants/Colors";
import errors from "../../resources/languages/errors";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../utils/helpers";
import { doRefreshToken } from "../../redux/actions/AuthActions";
import { doGetChatList } from "../../redux/actions/ChatActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import Loader from "../../components/loaders/Loader";
import * as globals from "../../utils/Globals";
import { TabStyle } from "../../../assets/styles/TabStyle";
import CustomOnebuttonComponent from "../../components/buttons/CustomOnebuttonComponent";
class ChatListingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTxt: "",
      allMsgData: [],
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseChatList !== this.props.responseChatList) {
      if (this.props.responseChatList !== undefined) {
        const { success, message, error, usersMessage, status_code } =
          this.props.responseChatList;

        if (status_code == 200 && success == true) {
          this.setAllChatData(usersMessage);
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

  componentDidMount() {
    this.getApiToken();
    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      this.getAllMessageList();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  getAllMessageList = async () => {
    if (globals.isInternetConnected == true) {
      let params = {
        username: this.state.searchTxt,
      };
      this.props.doGetChatList(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  searchByName(searchText) {
    this.setState({ searchTxt: searchText }, () => {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        this.getAllMessageList();
      }, 500);
    });
  }

  clickononFilter = () => {
    this.props.navigation.navigate("ChatFilter");
  };

  setAllChatData = (usersMessage) => {
    this.setState({
      allMsgData: usersMessage,
    });
  };

  gotoDetailofMessage = (item, index) => {
    this.props.navigation.navigate("ChatDetail", {
      other_user_info_Id: item.id,
      isFrom: "WithoutFilter",
    });
  };

  renderAllMessageview = (item, index) => {
    let localtime;
    if (item.created_at) {
      var stillUtc = moment(item.created_at).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      localtime = moment(stillUtc).format("hh:mm a");
    }

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
          <View style={[TabStyle.dotView, { marginHorizontal: 0 }]}></View>
        ) : (
          <View
            style={{
              width: hp(1),
            }}
          ></View>
        )}

        <View style={{ marginLeft: wp(3), width: wp(38) }}>
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

        <View style={{ marginLeft: wp(6.8) }}>
          <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
            {item.created_at ? localtime : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  onClickmessage = () => {
    this.props.navigation.navigate("SearchUser");
  };

  render() {
    const { searchTxt, allMsgData } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} headerText={"Message"} />
        <View
          style={[
            TabStyle.marginfromallside,
            TabStyle.onlyFlex,
            { marginVertical: hp(1) },
          ]}
        >
          <View style={{ marginBottom: hp(3) }}>
            <CustomOnebuttonComponent
              segmentOneTitle={strings.message}
              segmentOneImage={images.messages_img}
              segmentOneTintColor={Colors.PRIMARY}
              onPressSegmentOne={() => this.onClickmessage()}
            />
          </View>

          <SearchByName
            blurOnSubmit={false}
            value={searchTxt}
            returnKeyType="done"
            autoCapitalize={"none"}
            onChangeText={this.searchByName.bind(this)}
            placeholderText={strings.search}
            onFilter={() => this.clickononFilter()}
          />

          {allMsgData.length == 0 ? (
            <>
              <View style={TabStyle.emptyview}>
                <Text numberOfLines={2} style={TabStyle.emptytext}>
                  {strings.noChatist}
                </Text>
              </View>
            </>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ marginVertical: hp(1) }} />
              <SectionList
                sections={allMsgData}
                renderItem={({ item, index }) =>
                  this.renderAllMessageview(item, index)
                }
                bounces={false}
                renderSectionHeader={({ section }) => (
                  <Text style={TabStyle.sectionHeader}>{section.title}</Text>
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => "D" + index.toString()}
              />
            </View>
          )}
        </View>
        {this.props.isBusyChatList ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyChatList: state.chat.isBusyChatList,
    responseChatList: state.chat.responseChatList,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doGetChatList,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatListingScreen);
