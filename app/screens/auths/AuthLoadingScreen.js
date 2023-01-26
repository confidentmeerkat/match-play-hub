import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import * as globals from "../../utils/Globals";
import {
  doGetUser,
  doGetUserExists,
  doRefreshToken,
  doSetCurrentUserData,
} from "../../redux/actions/AuthActions";
import { CommonActions } from "@react-navigation/native";
import { showErrorMessage } from "../../utils/helpers";
import errors from "../../resources/languages/errors";
import strings from "../../resources/languages/strings";
import { EventRegister } from "react-native-event-listeners";

class AuthLoadingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      notificationData: props.notificationData,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate = async (prevProps) => {
    //Notification Data
    if (prevProps.notificationData !== this.props.notificationData) {
      this.setState({ notificationData: this.props.notificationData });
    }

    if (
      prevProps.responseUserExistsdata !== this.props.responseUserExistsdata
    ) {
      if (this.props.responseUserExistsdata !== undefined) {
        const { success, message, status_code } =
          this.props.responseUserExistsdata;
        if (status_code == 200 && success == true) {
          this.props.doGetUser();
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code == 402) {
            showErrorMessage(message);
            this.clearUserData();
            this.doFinish("Login");
          } else if (status_code == 500) {
            showErrorMessage(strings.somethingWrong);
            this.clearUserData();
            this.doFinish("Login");
          } else {
            this.doFinish("Login"); //Navigation - Go to the login
          }
        }
      }
    }

    if (prevProps.responseUserdata !== this.props.responseUserdata) {
      if (this.props.responseUserdata !== undefined) {
        const { success, user, message, status_code } =
          this.props.responseUserdata;

        if (status_code == 200 && success == true) {
          this.doFinish("Home"); //Navigation - Go to the Dashboard
          AsyncStorage.setItem(prefEnum.TAG_USER, JSON.stringify(user));
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code == 402) {
            showErrorMessage(message);
            this.clearUserData();
            this.props.navigation.navigate("AuthLoading");
          } else if (status_code == 500) {
            showErrorMessage(strings.somethingWrong);
            const accessToken = await AsyncStorage.getItem(
              prefEnum.TAG_API_TOKEN
            );
            globals.access_token = accessToken;

            if (globals.isInternetConnected == false) {
              showErrorMessage(errors.no_internet);
              if (accessToken === null || accessToken === undefined) {
                this.doFinish("Login");
              } else {
                this.doFinish("Home");
              }
              return;
            }
          } else {
            this.doFinish("Login"); //Navigation - Go to the login
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
          this.doFinish("Home"); //Navigation - Go to the Dashboard
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
            this.doFinish("Login"); //Navigation - Go to the login
          }
        }
      }
    }
  };

  async componentDidMount() {
    await this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const accessToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    let userJson = await AsyncStorage.getItem(prefEnum.TAG_USER);
    if (userJson !== undefined && userJson !== null) {
      this.props.doSetCurrentUserData(JSON.parse(userJson));
    }
    globals.access_token = accessToken;
    if (globals.isInternetConnected == true) {
      if (accessToken === null || accessToken === undefined) {
        this.doFinish("Login");
      } else {
        this.doNavigationAction();
      }
      return;
    } else {
      Alert.alert(globals.warning, globals.noInternet);
      if (accessToken === null || accessToken === undefined) {
        this.doFinish("Login");
      } else {
        this.doFinish("Home");
      }
    }
    // await this.props.doGetUserExists();
  };

  clearandresettoScreen = (routename, param) => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routename,
            params: {
              matchDetail: JSON.parse(param),
              from: "notification",
            },
          },
        ],
      })
    );
  };

  doNavigationAction = async () => {
    if (this.state.notificationData !== undefined) {
      if (this.state.notificationData.userInteraction == true) {
        const { targetScreen } = this.state.notificationData.data;
        if (targetScreen !== undefined) {
          if (targetScreen === "invite_user") {
            const { upcomingMatch } = this.state.notificationData.data;
            // this.props.navigation.dispatch(
            //   CommonActions.navigate({
            //     name: "Home",
            //     params: {
            //       screen: "MATCH",
            //       params: {
            //         screen: "MatchDetailUserInvited",
            //         params: {
            //           matchDetail: JSON.parse(upcomingMatch),
            //           from: "notification",
            //         },
            //       },
            //     },
            //   })
            // );
            this.clearandresettoScreen("MatchDetailUserInvited", upcomingMatch);
          } else if (targetScreen === "confirm_decline_match") {
            const { upcomingMatch } = this.state.notificationData.data;
            this.clearandresettoScreen("OnlyMatchDetail", upcomingMatch);
          } else if (targetScreen === "final_match") {
            const { upcomingMatch } = this.state.notificationData.data;
            this.clearandresettoScreen("OnlyMatchDetail", upcomingMatch);
          } else if (targetScreen === "request_to_play") {
            const { upcomingMatch } = this.state.notificationData.data;
            this.clearandresettoScreen(
              "MatchDetailInterestedandConfirmPlayers",
              upcomingMatch
            );
          } else if (targetScreen === "delete_match") {
            this.props.navigation.dispatch(
              CommonActions.navigate({
                name: "Home",
                params: { screen: "MATCH", from: "notification" },
              })
            );
            EventRegister.emit("RefreshMatchList");
          } else if (targetScreen === "sent_connection_request") {
            this.props.navigation.dispatch(
              CommonActions.navigate({
                name: "Home",
                params: {
                  screen: "PLAY",
                  params: {
                    screen: "PLAY",
                    params: { isfrom: "manageRequest", from: "notification" },
                  },
                },
              })
            );
          } else if (targetScreen === "new_message") {
            const { user_id } = this.state.notificationData.data;
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "ChatDetail",
                    params: {
                      other_user_info_Id: user_id,
                      isFrom: "WithoutFilter",
                      from: "notification",
                    },
                  },
                ],
              })
            );
          }
        }
      }
    } else {
      if (globals.isInternetConnected == true) {
        this.props.doGetUserExists();
      } else {
        showErrorMessage(errors.no_internet);
      }
      // clearTimeout(this.timeHome);
      // this.timeHome = setTimeout(() => {
      //   this.doFinish("Home"); //Navigation - Go to the Dashboard
      // }, 200);
    }
  };

  doFinish = (routeName) => {
    let resetAction = CommonActions.reset({
      index: 0,
      key: null,
      routes: [{ name: routeName }],
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

  render() {
    return <></>;
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser,
    responseUserExistsdata: state.auth.responseUserExistsdata,
    responseUserdata: state.auth.responseUserdata,
    notificationData: state.app.notificationData,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      { doGetUserExists, doGetUser, doSetCurrentUserData, doRefreshToken },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
