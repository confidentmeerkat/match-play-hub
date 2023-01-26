import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  LogBox,
  TextInput,
  Text,
  Platform,
  BackHandler,
  Alert,
  StatusBar,
} from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import FlashMessage from "react-native-flash-message";
import Colors from "./app/constants/Colors";
import MyStack from "./app/index";
import CustomStatusBar from "./app/components/StatusBar/CustomStatusBar";
import linking from "./app/utils/linking";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { prefEnum } from "./app/resources/constants";
import { doSetNotificationData } from "./app/redux/actions/AppActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import NotificationController from "./app/utils/NotificationController";
import { EventRegister } from "react-native-event-listeners";
import { navigationRef } from "./app/utils/RootNavigation";
import { showErrorMessage } from "./app/utils/helpers";
import NetInfo from "@react-native-community/netinfo";
import * as globals from "./app/utils/Globals";

// const navigationRef = React.createRef();
const routeNameRef = React.createRef();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  indicatorView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  flashMessageAndroidStyle: {
    marginTop: StatusBar.currentHeight,
  },
  flashMessageiOSStyle: {
    marginTop: 0,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false; //<--------Set allowFontScaling false for Screen

    // if (TextInput.defaultProps == null) Input.defaultProps = {};
    // TextInput.defaultProps.allowFontScaling = false; //<--------Set allowFontScaling false for Screen

    if (Alert.defaultProps == null) Alert.defaultProps = {};
    Alert.defaultProps.allowFontScaling = false; //<--------Set allowFontScaling false for Screen
    this.exitCount = 0;
    this.state = {
      loading: true,
      validCloseWindow: false,
    };
    this.unsubscribe = null;
  }

  async componentDidMount() {
    await this.checkInterConnectAndUpdate();

    // Check Internet connection and update globals variable
    this.checkInternet();
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    FlashMessage.setColorTheme({
      success: Colors.AQUA_BLUE,
      // info: "#75a4f6",
      // warning: "#ff9398",
      // danger: "#d990fb",
    });
    this.setState({ loading: false });
    this.checkPermission();
    this.notification = new NotificationController(this.doClickNotificationOpen.bind(this));
    if (Platform.OS === "ios") {
      PushNotificationIOS.addEventListener("register", (token) => {});
      PushNotificationIOS.requestPermissions();
    }
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken) => {
      AsyncStorage.setItem(prefEnum.TAG_FCM_TOKEN, fcmToken);
    });
  }

  checkInterConnectAndUpdate = () => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch()
        .then((state) => {
          globals.isInternetConnected = state.isConnected;
          resolve("1");
        })
        .catch((error) => {
          console.log("Error :->", error);
          reject("0");
        });
    });
  };

  checkInternet = () => {
    if (this.unsubscribe == null) {
      this.unsubscribe = NetInfo.addEventListener((state) => {
        globals.isInternetConnected = state.isConnected;
      });
    }
  };

  /**
   * We need to check Permission for Push notification
   * First it check permission then it will retrieve
   * Device Token for Push Notification
   *
   */
  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }
  /**
   *  it will retrieve Device Token for Push Notification
   *  and Store in Local Storage
   */
  async getToken() {
    let fcmToken = await AsyncStorage.getItem(prefEnum.TAG_FCM_TOKEN);
    console.log("fcmToken", fcmToken);
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        AsyncStorage.setItem(prefEnum.TAG_FCM_TOKEN, fcmToken);
      }
    }
  }
  /**
   *  it will ask permission for allow push notification in device
   */
  async requestPermission() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        this.getToken();
      }
    } catch (error) {
      console.log(`error`, error);
    }
  }

  doClickNotificationOpen = async (notificationOpen) => {
    this.props.doSetNotificationData(notificationOpen);
    if (notificationOpen.data !== undefined) {
      if (notificationOpen.userInteraction == true) {
        const { targetScreen } = notificationOpen.data;

        if (targetScreen !== undefined) {
          if (targetScreen === "invite_user") {
            const { upcomingMatch } = notificationOpen.data;
            navigationRef.current?.navigate("MatchDetailUserInvited", {
              matchDetail: JSON.parse(upcomingMatch),
            });
          } else if (targetScreen === "confirm_decline_match") {
            const { upcomingMatch } = notificationOpen.data;
            navigationRef.current?.navigate("OnlyMatchDetail", {
              matchDetail: JSON.parse(upcomingMatch),
            });
          } else if (targetScreen === "final_match") {
            const { upcomingMatch } = notificationOpen.data;
            navigationRef.current?.navigate("OnlyMatchDetail", {
              matchDetail: JSON.parse(upcomingMatch),
            });
          } else if (targetScreen === "request_to_play") {
            const { upcomingMatch } = notificationOpen.data;
            navigationRef.current?.navigate("MatchDetailInterestedandConfirmPlayers", {
              matchDetail: JSON.parse(upcomingMatch),
            });
          } else if (targetScreen === "delete_match") {
            navigationRef.current?.navigate("MATCH");
            EventRegister.emit("RefreshMatchList");
          } else if (targetScreen === "sent_connection_request") {
            navigationRef.current?.navigate("PLAY", {
              isfrom: "manageRequest",
            });
          } else if (targetScreen === "new_message") {
            const currentRouteName = navigationRef.current.getCurrentRoute().name;
            const { user_id } = notificationOpen.data;
            if (currentRouteName == "ChatDetail") {
              EventRegister.emit("RefreshChat", {
                other_user_info_Id: user_id,
                isFrom: "WithoutFilter",
              });
            } else {
              navigationRef.current?.navigate("ChatDetail", {
                other_user_info_Id: user_id,
                isFrom: "WithoutFilter",
              });
            }
          }
        }
      }
    }
  };

  handleBackButton = () => {
    if (
      navigationRef.current.getCurrentRoute().name === "HUB" ||
      navigationRef.current.getCurrentRoute().name === "ChatDetail" ||
      navigationRef.current.getCurrentRoute().name === "MATCH" ||
      navigationRef.current.getCurrentRoute().name === "PLAY" ||
      navigationRef.current.getCurrentRoute().name === "MatchDetailInterestedandConfirmPlayers" ||
      navigationRef.current.getCurrentRoute().name === "OnlyMatchDetail" ||
      navigationRef.current.getCurrentRoute().name === "MatchDetailUserInvited" ||
      navigationRef.current.getCurrentRoute().name === "Login"
    ) {
      this.exitApp();
    }
    // dispatch(NavigationActions.back());
    // navigationRef.current?.navigate("Home");
    return true;
  };

  exitApp = () => {
    this.setTimeoutForExitApp();
    if (this.exitCount >= 2) {
      BackHandler.exitApp();
    } else {
      showErrorMessage("Please click BACK again to exit.!");
    }
    return true;
  };

  setTimeoutForExitApp = () => {
    this.exitCount += 1;
    setTimeout(() => {
      this.exitCount = 0;
    }, 2500);
  };

  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
    }
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  render() {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    LogBox.ignoreLogs(["EventEmitter.removeListener"]);
    LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
    LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
    LogBox.ignoreAllLogs(); //Ignore all log notifications
    LogBox.ignoreLogs(["Sending..."]);
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

    if (this.state.loading) {
      return (
        <View style={styles.indicatorView}>
          <ActivityIndicator color={Colors.WHITE} size="large" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <CustomStatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
        <NavigationContainer linking={linking} ref={navigationRef}>
          <MyStack />
        </NavigationContainer>
        <FlashMessage
          position="top"
          style={[Platform.OS === "android" ? styles.flashMessageAndroidStyle : styles.flashMessageiOSStyle]}
          textStyle={styles.flashMessageAndroidStyle}
          floating={Platform.OS !== "ios"}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    notificationData: state.app.notificationData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ doSetNotificationData }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
