import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  LogBox,
  View,
  Platform,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { GiftedChat, Actions, Send } from "react-native-gifted-chat";
import { TabCommonStyle } from "../../../assets/styles/TabCommonStyle";
import Header from "../../components/Header/Header";
import strings from "../../resources/languages/strings";
import images from "../../resources/images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import Colors from "../../constants/Colors";
import errors from "../../resources/languages/errors";
import { showSuccessMessage, showErrorMessage } from "../../utils/helpers";
import { doRefreshToken } from "../../redux/actions/AuthActions";
import {
  doGetChatDetail,
  doPostSendMessage,
  doDeleteMessages,
  doArchiveMessages,
  doBlockUser,
} from "../../redux/actions/ChatActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import * as globals from "../../utils/Globals";
import { TabStyle } from "../../../assets/styles/TabStyle";
import {
  renderInputToolbar,
  renderComposer,
} from "../../components/Chat/InputToolbar";
import {
  renderBubble,
  renderSystemMessage,
} from "../../components/Chat/MessageContainer";
import { ProfileStyle } from "../../../assets/styles/ProfileStyle";
import CustomTwoSegmentCoponent from "../../components/buttons/CustomTwoSegmentCoponent";
import Loader from "../../components/loaders/Loader";
import * as ImagePicker from "react-native-image-picker";
import { DefaultOptions } from "../../constants/DefaultOptions";
import ImageModal from "react-native-image-modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { EventRegister } from "react-native-event-listeners";
import CustomOnebuttonComponent from "../../components/buttons/CustomOnebuttonComponent";

class ChatDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      other_user_info: {},
      other_user_info_Id: props.route.params.other_user_info_Id,
      isFrom: props.route.params.isFrom,
      messages: [],
      inputText: "",
      currentUser: {},
      loading: false,
      page: 1,
      last_page: 1,
      limit: 20,
      totalPage: "",
      refreshData: false,
      photoUrl: "",
      photoObj: [],
      options: DefaultOptions,
      isrenderAccessory: false,
      keyboardStatus: false,
      comingFrom: "",
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    //Current - User
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setState({
        currentUser: this.props.currentUser,
      });
    }

    if (prevProps.responseBlockUser !== this.props.responseBlockUser) {
      if (this.props.responseBlockUser !== undefined) {
        const { success, message, status_code } = this.props.responseBlockUser;

        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.state.isFrom == "Filter"
            ? EventRegister.emit("RefreshArchiveChatlist")
            : this.state.isFrom == "searchblockFilter"
            ? EventRegister.emit("RefreshBlockedlist")
            : null;
          this.props.navigation.goBack();
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
      prevProps.responseArchiveMessage !== this.props.responseArchiveMessage
    ) {
      if (this.props.responseArchiveMessage !== undefined) {
        const { success, message, status_code } =
          this.props.responseArchiveMessage;

        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.props.navigation.goBack();
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

    if (prevProps.responseChatDetail !== this.props.responseChatDetail) {
      if (this.props.responseChatDetail !== undefined) {
        const { success, page, message, error, msgDis, userInfo, status_code } =
          this.props.responseChatDetail;
        if (status_code == 200 && success == true) {
          this.setMessgaes(msgDis, page, userInfo);
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

    if (prevProps.responseSendMessage !== this.props.responseSendMessage) {
      if (this.props.responseSendMessage !== undefined) {
        const { success, message, error, page, msgDis, userInfo, status_code } =
          this.props.responseSendMessage;

        if (status_code == 200 && success == true) {
          this.setMessgaesafterSend(msgDis, page, userInfo);
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.setState({ loading: false });
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            this.setState({ loading: false });
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
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
          }
        }
      }
    }

    if (prevProps.responseDeleteMessage !== this.props.responseDeleteMessage) {
      if (this.props.responseDeleteMessage !== undefined) {
        const { success, message, error, status_code } =
          this.props.responseDeleteMessage;

        if (status_code == 200 && success == true) {
          this.getAllMessageDeatils();
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
    const { from } = this.props.route.params;
    if (from !== undefined && from === "notification") {
      this.setState({ comingFrom: from });
    }
    this.getApiToken();
    this.getAllMessageDeatils();
    if (this.props.currentUser !== undefined) {
      this.setCurrentUser();
    }
    this.showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      this.setState({ keyboardStatus: true });
    });
    this.hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      this.setState({ keyboardStatus: false });
    });
    this.listener = EventRegister.addEventListener(
      "RefreshChat",
      ({ other_user_info_Id, isFrom, from }) => {
        this.setState(
          {
            other_user_info_Id: other_user_info_Id,
            isFrom: isFrom,
          },
          () => {
            this.getAllMessageDeatils();
          }
        );
      }
    );
  }
  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    this.showSubscription.remove();
    this.hideSubscription.remove();
  }

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
    });
  };

  setMessgaesafterSend = (msgDis, page, userInfo) => {
    this.setState({
      isrenderAccessory: false,
      photoUrl: "",
      messages:
        page.page === "1" || page.page === 1
          ? msgDis
          : [...this.state.messages, ...msgDis],
      other_user_info: userInfo,
      last_page: 1,
      page: 1,
      photoObj: [],
      loading: false,
    });
    setTimeout(() => {
      this.instance._messageContainerRef.current.scrollToIndex({
        index: 0,
        viewOffset: 0,
        viewPosition: 1,
        useNativeDriver: false,
        animated: true,
      });
    }, 1000);
  };

  setMessgaes = async (msgDis, page, userInfo) => {
    // this.setState((previousState) => {
    //   return {
    //     messages: GiftedChat.append(previousState.messages, msgDis),
    //   };
    // });
    // this.setState({ other_user_info: userInfo });
    let lastpage = Math.ceil(page.total / page.limit);
    this.setState({
      messages:
        page.page === "1" || page.page === 1
          ? msgDis
          : [...this.state.messages, ...msgDis],
      last_page: parseInt(lastpage),
      other_user_info: userInfo,
      totalPage: page.total,
    });
  };

  getAllMessageDeatils = async () => {
    const { other_user_info_Id, page, limit } = this.state;

    if (globals.isInternetConnected == true) {
      let params = {
        to_id: other_user_info_Id,
        page: page,
        limit: limit,
      };
      this.props.doGetChatDetail(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  componentWillUnmount() {}

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  onSend = async (newMessages = []) => {
    const { inputText, photoObj, other_user_info_Id } = this.state;
    // if (inputText.trim() === "") {
    //   return;
    // }

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, newMessages),
      };
    });
    const photoobject = {
      name: photoObj.name,
      type: photoObj.type,
      uri: photoObj.uri,
    };

    if (globals.isInternetConnected == true) {
      // if (inputText.trim() === "") {
      //   return;
      // }
      const params = {
        to_id: other_user_info_Id,
        file:
          photoObj.uri == undefined || (photoObj.uri == "") != []
            ? " "
            : photoobject,
        message: inputText,
      };
      this.props.doPostSendMessage(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  onInputChanged = (text) => {
    this.setState({ inputText: text });
  };

  onLongPress = (message) => {
    Alert.alert(
      strings.dialog_title_confirm_delete,
      strings.dialog_message_confirm_delete,
      [
        {
          text: strings.btn_cancel,
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: strings.btn_delete,
          onPress: () => {
            this.deleteMessageAPi(message);
          },
        },
      ],
      { cancelable: false }
    );
  };

  deleteMessageAPi = async (message) => {
    if (globals.isInternetConnected == true) {
      let params = {
        _id: message._id,
      };
      this.props.doDeleteMessages(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  }

  loadMoreMessage() {
    if (this.state.page < this.state.totalPage) {
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this.getAllMessageDeatils();
        }
      );
    }
  }

  gotoBlockUser = () => {
    Alert.alert(
      strings.dialog_title_confirm_block,
      strings.dialog_message_confirm_block,
      [
        {
          text: strings.btn_cancel,
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: strings.btn_block,
          onPress: () => {
            this.gotoBlockUserAPi("block");
          },
        },
      ],
      { cancelable: false }
    );
  };

  gotoUnBlockUser = () => {
    Alert.alert(
      strings.dialog_title_confirm_unblock,
      strings.dialog_message_confirm_unblock,
      [
        {
          text: strings.btn_cancel,
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: strings.btn_unblock,
          onPress: () => {
            this.gotoBlockUserAPi("unblock");
          },
        },
      ],
      { cancelable: false }
    );
  };

  gotoBlockUserAPi = async (status) => {
    const { other_user_info_Id } = this.state;

    if (globals.isInternetConnected == true) {
      let params = {
        to_id: other_user_info_Id,
        status: status,
      };
      this.props.doBlockUser(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoArchiveChat = async () => {
    Alert.alert(
      strings.dialog_title_confirm_archive,
      strings.dialog_message_confirm_archive,
      [
        {
          text: strings.btn_cancel,
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: strings.btn_archive,
          onPress: () => {
            this.gotoArchiveChatAPi();
          },
        },
      ],
      { cancelable: false }
    );
  };

  gotoUnArchiveChat = async () => {
    Alert.alert(
      strings.dialog_title_confirm_unarchive,
      strings.dialog_message_confirm_unarchive,
      [
        {
          text: strings.btn_cancel,
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: strings.btn_unarchive,
          onPress: () => {
            this.gotoUnArchiveChatAPi();
          },
        },
      ],
      { cancelable: false }
    );
  };

  gotoUnArchiveChatAPi = async () => {
    const { other_user_info_Id } = this.state;

    if (globals.isInternetConnected == true) {
      let params = {
        to_id: other_user_info_Id,
        status: "unarchive",
      };
      this.props.doBlockUser(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoArchiveChatAPi = async () => {
    const { other_user_info_Id } = this.state;

    if (globals.isInternetConnected == true) {
      let params = {
        to_id: other_user_info_Id,
      };
      this.props.doArchiveMessages(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  navigatetoUserProfile = () => {
    this.props.navigation.navigate("AllConnectionDetail", {
      other_user_info: this.state.other_user_info,
    });
  };

  returnOtherUserInfo = () => {
    const { other_user_info, messages, isFrom } = this.state;
    let sportsData = [];
    if (other_user_info.assign_sport) {
      sportsData = other_user_info.assign_sport.map(
        (data, index, other_user_info) => {
          return (
            <Text key={index} style={[TabStyle.smalltextview]}>
              {data.title + "(" + data.status + ")"}
              {index != other_user_info.length - 1 ? ", " : ""}
            </Text>
          );
        }
      );
    }
    return (
      <>
        <View style={{ marginHorizontal: wp(5), marginTop: -hp(2) }}>
          {other_user_info.is_archive == true && isFrom != "Filter" ? (
            <View style={{ marginVertical: hp(2) }}>
              <CustomOnebuttonComponent
                segmentOneTitle={strings.blockUser}
                segmentOneImage={images.find_img}
                onPressSegmentOne={() => this.gotoBlockUser()}
              />
            </View>
          ) : isFrom == "searchblockFilter" ? (
            <View style={{ marginVertical: hp(2) }}>
              <CustomOnebuttonComponent
                segmentOneTitle={strings.unblocked}
                segmentOneImage={images.find_img}
                onPressSegmentOne={() => this.gotoUnBlockUser()}
              />
            </View>
          ) : (
            <CustomTwoSegmentCoponent
              segmentOneTitle={strings.blockUser}
              segmentOneImage={images.find_img}
              segmentTwoTitle={
                isFrom == "Filter" ? strings.unarchiveChat : strings.archiveChat
              }
              segmentTwoImage={images.add_img}
              isSelectedTab={"true"}
              onPressSegmentOne={() => this.gotoBlockUser()}
              onPressSegmentTwo={() =>
                isFrom == "Filter"
                  ? this.gotoUnArchiveChat()
                  : this.gotoArchiveChat()
              }
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => this.navigatetoUserProfile()}
          style={TabStyle.chatUserinfo}
        >
          <View style={ProfileStyle.middle_view}>
            <FastImage
              resizeMethod="resize"
              style={ProfileStyle.imageStyle}
              source={
                other_user_info.profile_url === ""
                  ? images.dummy_user_img
                  : { uri: other_user_info.profile_url }
              }
            ></FastImage>
          </View>
          <View style={[{ marginLeft: wp(5) }]}>
            <Text
              numberOfLines={1}
              style={[ProfileStyle.headertext, { width: wp(50) }]}
            >
              {other_user_info.username ? other_user_info.username : ""}
            </Text>
            {other_user_info.gender ? (
              <Text
                numberOfLines={1}
                style={[ProfileStyle.smalltextview, { width: wp(50) }]}
              >
                {other_user_info.gender ? other_user_info.gender : ""}{" "}
                {other_user_info.age ? other_user_info.age : ""}
              </Text>
            ) : null}

            {other_user_info.location ? (
              <View style={{ flexDirection: "row", marginTop: hp(0.2) }}>
                <FastImage
                  resizeMode="contain"
                  tintColor={Colors.GREY}
                  style={[ProfileStyle.locationicon]}
                  source={images.fill_location_img}
                ></FastImage>

                <Text
                  numberOfLines={1}
                  style={[ProfileStyle.smalltextview, { width: wp(50) }]}
                >
                  {other_user_info.location ? other_user_info.location : ""}
                </Text>
              </View>
            ) : null}
            {sportsData.length > 2 ? (
              <View style={{ flexDirection: "row", marginTop: hp(0.1) }}>
                <Text style={[TabStyle.singleSports]} numberOfLines={1}>
                  {sportsData}
                </Text>
                <Text
                  style={[TabStyle.multipleSports, { marginVertical: 0 }]}
                  numberOfLines={1}
                >
                  {"+" + sportsData.length + " Sports"}
                </Text>
              </View>
            ) : (
              <Text style={TabStyle.singleSports} numberOfLines={1}>
                {sportsData}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={TabStyle.chatbottomline}></View>
        {messages.length == 0 ? (
          <View style={TabStyle.emptyview}>
            <Text numberOfLines={2} style={TabStyle.emptytext}>
              {strings.noMsg}
            </Text>
          </View>
        ) : null}
      </>
    );
  };

  renderActions = () => {
    return (
      <Actions
        containerStyle={TabStyle.renderactionschat}
        icon={() => (
          <FastImage
            style={{ width: 22, height: 22, alignSelf: "center" }}
            source={images.round_plus_img}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
        options={{
          "Choose From Library": () => {
            this.chooseMedia();
          },
          "Choose From Camera": () => {
            this.captureImage();
          },
        }}
        optionTintColor={Colors.PRIMARY}
      />
    );
  };

  // capture img from camera
  captureImage = async () => {
    if (Platform.OS == "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "MatchPlayHub Camera Permission",
            message:
              "MatchPlayHub App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log("You can use the camera");
        } else {
          console.log("Camera permission denied");

          this.setState({
            photoUrl: "",
          });
          return;
        }
      } catch (err) {}
    }

    ImagePicker.launchCamera(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel === true) {
        } else {
          const source = {
            uri: response.uri,
            name: response.fileName ? response.fileName : "Dummy.jpg",
            size: response.fileSize,
            type: response.type,
          };
          this.setState({
            photoUrl: response.uri,
            photoObj: source,
            isrenderAccessory: true,
          });
        }
      }
    );
  };

  // choose profile photo from gallery
  chooseMedia = async () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel === true) {
        } else {
          const source = {
            uri: response.uri,
            name: response.fileName ? response.fileName : "Dummy.jpg",
            size: response.fileSize,
            type: response.type,
          };

          this.setState({
            photoUrl: response.uri,
            photoObj: source,
            isrenderAccessory: true,
          });
        }
      }
    );
  };

  renderMessageImage(props) {
    return (
      <View style={props.containerStyle}>
        <ImageModal
          style={{
            borderRadius: 13,
            height: 100,
            margin: 3,
            width: 150,
          }}
          source={{ uri: props.currentMessage.image }}
          resizeMode="cover"
          modalImageResizeMode="contain"
        />
      </View>
    );
  }

  removedSelectedImage = () => {
    this.setState({ isrenderAccessory: false, photoUrl: "", photoObj: [] });
  };

  renderAccessoryView = () => {
    return (
      <View
        style={{
          backgroundColor: Colors.WHITE,
          marginHorizontal: wp(5),
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => this.removedSelectedImage()}
          style={{ position: "absolute", left: wp(20) }}
        >
          <FastImage
            style={TabStyle.verysmallIcon}
            tintColor={Colors.PRIMARY}
            source={images.close_img}
          ></FastImage>
        </TouchableOpacity>
        <FastImage
          resizeMethod="contain"
          resizeMode={FastImage.resizeMode.cover}
          style={ProfileStyle.chatimgs}
          source={
            this.state.photoUrl === ""
              ? images.dummy_user_img
              : { uri: this.state.photoUrl }
          }
        ></FastImage>
      </View>
    );
  };

  scrollToBottomComponent() {
    return (
      <View style={TabStyle.bottomComponentContainer}>
        <AntDesign icon="downcircle" size={36} color={Colors.PRIMARY} />
      </View>
    );
  }

  customSendPress = (text, onSend) => {
    const { photoUrl } = this.state;
    if (photoUrl) {
      this.setState({ loading: true }, () => {
        this.sendonPress(text, onSend);
      });
    } else {
      this.sendonPress(text, onSend);
    }
  };

  sendonPress = (text, onSend) => {
    const { photoUrl } = this.state;
    if (photoUrl && !text && onSend) {
      onSend({ text: text.trim() }, true);
      this.setState({ photoUrl: "", isrenderAccessory: false }, () => {
        this.forceUpdate();
      });
    } else if (text && onSend) {
      if (text && text.trim() === "") {
      } else {
        onSend({ text: text.trim() }, true);
      }
      0;
    } else {
      return false;
    }
  };

  customSend = ({ onSend, text, photoUrl, sendButtonProps, ...sendProps }) => {
    return (
      <Send
        {...sendProps}
        containerStyle={TabStyle.rendersendContainer}
        sendButtonProps={{
          ...sendButtonProps,
          onPress: () => this.customSendPress(text, onSend),
        }}
      >
        <FastImage
          style={{ width: 22, height: 22, tintColor: Colors.WHITE }}
          source={images.share_img}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Send>
    );
  };

  render() {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
    const {
      messages,
      photoUrl,
      isrenderAccessory,
      inputText,
      currentUser,
      loading,
      keyboardStatus,
      isFrom,
      other_user_info,
      comingFrom,
    } = this.state;
    var user_id = currentUser.id;
    let platformConf =
      Platform.OS === "ios"
        ? {
            minInputToolbarHeight: 3,
            bottomOffset: 0,
          }
        : {
            minInputToolbarHeight: hp(3),
            bottomOffset: 0,
          };
    return (
      <SafeAreaView style={[TabCommonStyle.container]}>
        <View
          style={[
            TabCommonStyle.container,
            {
              paddingBottom: 10,
            },
          ]}
        >
          <Header
            isFrom={comingFrom}
            isHideBack
            props={this.props}
            headerText={"Message"}
          />
          <View style={[TabStyle.onlyFlex]}>
            {keyboardStatus ? null : (
              <View
                style={{
                  height: Platform.OS == "android" ? hp(30) : hp(35),
                }}
              >
                {this.returnOtherUserInfo()}
              </View>
            )}

            <GiftedChat
              ref={(c) => {
                this.instance = c;
              }}
              user={{
                _id: Number(user_id),
              }}
              messages={messages}
              text={inputText}
              onInputTextChanged={(text) => this.onInputChanged(text)}
              onSend={this.onSend}
              isLoadingEarlier={loading}
              listViewProps={{
                scrollEventThrottle: 400,
                onScroll: ({ nativeEvent }) => {
                  if (this.isCloseToTop(nativeEvent)) {
                    this.setState({ refreshing: true });
                    this.loadMoreMessage();
                  }
                },
              }}
              minComposerHeight={28}
              maxComposerHeight={50}
              maxInputLength={1000}
              keyboardShouldPersistTaps="never"
              alwaysShowSend={
                inputText
                  ? inputText.trim() === ""
                    ? false
                    : true
                  : false || photoUrl
                  ? true
                  : false
              }
              placeholder={"Write a reply..."}
              renderInputToolbar={
                other_user_info.is_block == true
                  ? () => null
                  : renderInputToolbar
              }
              renderSend={this.customSend}
              renderComposer={renderComposer}
              renderActions={this.renderActions}
              sent={false}
              scrollToBottomComponent={this.scrollToBottomComponent}
              renderBubble={renderBubble}
              renderSystemMessage={renderSystemMessage}
              accessoryStyle={{
                height: isrenderAccessory ? hp(13) : 0,
                backgroundColor: Colors.WHITE,
              }}
              renderAccessory={() =>
                isrenderAccessory ? this.renderAccessoryView() : null
              }
              parsePatterns={(linkStyle) => [
                {
                  pattern: /#(\w+)/,
                  style: linkStyle,
                  onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
                },
              ]}
              renderAvatar={null}
              scrollToBottom={true}
              isCustomViewBottom={true}
              {...platformConf}
              isKeyboardInternallyHandled={true}
              messagesContainerStyle={{
                backgroundColor: Colors.WHITE,
                bottom: Platform.OS == "android" ? 0 : hp(5),
                marginTop: Platform.OS == "android" ? 0 : hp(0.5),
              }}
              renderMessageImage={(props) => this.renderMessageImage(props)}
              // extraData={messages}
            />
          </View>
          {this.props.isBusyArchiveMessage ||
          this.props.isBusyBlockUser ||
          this.props.isBusyDeleteMessage ||
          this.props.isBusyChatDetail ||
          loading ? (
            <Loader />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyBlockUser: state.chat.isBusyBlockUser,
    responseBlockUser: state.chat.responseBlockUser,
    isBusyArchiveMessage: state.chat.isBusyArchiveMessage,
    responseArchiveMessage: state.chat.responseArchiveMessage,
    isBusyDeleteMessage: state.chat.isBusyDeleteMessage,
    isBusyChatDetail: state.chat.isBusyChatDetail,
    responseChatDetail: state.chat.responseChatDetail,
    responseSendMessage: state.chat.responseSendMessage,
    responseDeleteMessage: state.chat.responseDeleteMessage,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
    currentUser: state.auth.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doDeleteMessages,
        doPostSendMessage,
        doGetChatDetail,
        doArchiveMessages,
        doBlockUser,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetailScreen);
