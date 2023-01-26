import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  View,
  Platform,
  BackHandler,
  FlatList,
  Text,
  ScrollView,
  TouchableOpacity,
  SectionList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Header from "../../../../components/Header/Header";
import strings from "../../../../resources/languages/strings";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";
import NetworkUtills from "../../../../utils/NetworkUtills";
import errors from "../../../../resources/languages/errors";
import Loader from "../../../../components/loaders/Loader";
import images from "../../../../resources/images";
import FastImage from "react-native-fast-image";
import MatchDetailComponent from "../../../../components/RenderFlatlistComponent/MatchDetailComponent";
import Colors from "../../../../constants/Colors";
import HeadingWithText from "../../../../components/RenderFlatlistComponent/HeadingWithText";
import {
  doGetInterestedPlayersList,
  doConfirmandDeclineMatch,
} from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import * as globals from "../../../../utils/Globals";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../utils/helpers";
import { EventRegister } from "react-native-event-listeners";
import { CommonActions } from "@react-navigation/native";

class MatchDetailInterestedandConfirmPlayersScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      interestedPlayersList: [],
      invitedPlayersList: [],
      confirmPlayersList: [],
      date: "",
      month: "",
      matchName: "",
      datetime: "",
      day: "",
      location: "",
      cost: "",
      age: "",
      gender: "",
      message: "",
      matchLevel: "",
      matchDetail: props.route.params.matchDetail,
      comingFrom: "",
      matchData: [],
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseBusyGetInterestedPlayerListdata !==
      this.props.responseBusyGetInterestedPlayerListdata
    ) {
      if (this.props.responseBusyGetInterestedPlayerListdata !== undefined) {
        const { success, message, status_code, matchData } =
          this.props.responseBusyGetInterestedPlayerListdata;

        if (status_code == 200 && success == true) {
          if (matchData) {
            this.setInterestedPlayers(matchData);
          } else {
          }
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
      prevProps.responseConfirmAndDeclinedata !==
      this.props.responseConfirmAndDeclinedata
    ) {
      if (this.props.responseConfirmAndDeclinedata !== undefined) {
        const { success, message, status_code, finalMatchData } =
          this.props.responseConfirmAndDeclinedata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.getInterestedPlayers();
          EventRegister.emit("RefreshMatchList");
          // this.props.navigation.navigate("MATCH");
          this.props.navigation.goBack();
          EventRegister.emit("UpdateMatchList", {
            updatedMatchData: finalMatchData,
          });
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

  async componentDidMount() {
    const { from } = this.props.route.params;
    if (from !== undefined && from === "notification") {
      this.setState({ comingFrom: from });
    }
    // if (Platform.OS == "android" && from === "notification") {
    //   this.backHandler = BackHandler.addEventListener(
    //     "hardwareBackPress",
    //     this.backAction("MATCH")
    //   );
    // }
    await this.getApiToken();
    await this.getInterestedPlayers();
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  componentWillUnmount() {
    // if (Platform.OS == "android") {
    //   this.backHandler.remove();
    // }
  }

  backAction = (routeName) => {
    let resetAction = CommonActions.reset({
      index: 0,
      key: null,
      routes: [{ name: routeName }],
    });
    this.props.navigation.dispatch(resetAction);
    return true;
  };

  getInterestedPlayers = async () => {
    const { matchDetail } = this.state;

    if (globals.isInternetConnected == true) {
      const params = {
        match_id: matchDetail.id,
      };
      this.props.doGetInterestedPlayersList(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
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

  setInterestedPlayers = (matchData) => {
    this.setState({
      matchData: matchData,
      invitedPlayersList: matchData.invited_player
        ? matchData.invited_player
        : [],
      interestedPlayersList: matchData.requested_player
        ? matchData.requested_player
        : [],
      date: matchData.match_date ? matchData.match_date : "",
      month: matchData.match_month ? matchData.match_month : "",
      matchName: matchData.sport ? matchData.sport : "",
      day: matchData.match_day ? matchData.match_day : "",
      datetime: matchData.match_time ? matchData.match_time : "",
      matchLevel: matchData.level ? matchData.level : "",
      location: matchData.location ? matchData.location : "",
      cost: matchData.cost ? matchData.cost : "",
      age: matchData.age_string ? matchData.age_string : "",
      gender: matchData.gender_string ? matchData.gender_string : "",
      message: matchData.message ? matchData.message : "",
      confirmPlayersList: matchData.confirmed_player
        ? matchData.confirmed_player
        : [],
    });
  };

  gotoMapScreen = () => {
    this.props.navigation.navigate("MapView", {
      matchDetail: this.state.matchDetail,
    });
  };

  gotoConfirmPlayer = async (item, index, isFrom) => {
    const { matchDetail } = this.state;
    if (isFrom == "InterestedPlayer" && matchDetail.open_sports == 0) {
      showErrorMessage(strings.pleaseCheckplayerlimit);
    } else {
      if (globals.isInternetConnected == true) {
        const params = {
          match_id: matchDetail.id,
          user_id: item.user_id,
          sent_by: 1,
          status: isFrom == "InterestedPlayer" ? "confirm" : "decline",
        };
        this.props.doConfirmandDeclineMatch(params);
      } else {
        showErrorMessage(errors.no_internet);
      }
    }
  };

  renderinterestedPlayersListview = (item, index, isFrom) => {
    return (
      <View key={index} style={TabStyle.interestedPlayermainFlatvew}>
        <View
          style={[
            TabStyle.rowFlexDiretion,
            { width: "70%", alignItems: "center" },
          ]}
        >
          <View style={[TabStyle.FlatinnerView, {}]}>
            <FastImage
              style={TabStyle.smalluserImg}
              source={
                item.profile_url === ""
                  ? images.dummy_user_img
                  : { uri: item.profile_url }
              }
            ></FastImage>
          </View>

          <View style={{ marginHorizontal: wp(1) }}></View>

          <View>
            <Text
              numberOfLines={1}
              style={[TabStyle.headertext, { width: wp(35) }]}
            >
              {item.username ? item.username : ""}
            </Text>
            {item.gender ? (
              <Text
                numberOfLines={1}
                style={[TabStyle.smalltextview, { width: wp(35) }]}
              >
                {item.gender ? item.gender + " " : ""}
                {item.age ? item.age : ""}
              </Text>
            ) : null}

            {item.location ? (
              <View style={{ flexDirection: "row" }}>
                <FastImage
                  resizeMode="contain"
                  tintColor={Colors.GREY}
                  style={TabStyle.verysmallIcon}
                  source={images.fill_location_img}
                ></FastImage>
                <Text
                  numberOfLines={1}
                  style={[TabStyle.smalltextview, { width: wp(35) }]}
                >
                  {item.location ? item.location : ""}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this.gotoConfirmPlayer(item, index, isFrom)}
          style={TabStyle.confirmCheckbox}
        >
          <Text numberOfLines={1} style={[TabStyle.smallConfirmplayertext]}>
            {isFrom == "ConfirmPlayer"
              ? strings.removePlayer
              : isFrom == "InvitedPlayer"
              ? strings.cancleinvite
              : strings.confirmPlayer}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      date,
      cost,
      message,
      location,
      month,
      age,
      gender,
      matchName,
      datetime,
      interestedPlayersList,
      confirmPlayersList,
      day,
      matchLevel,
      comingFrom,
      invitedPlayersList,
      matchData,
    } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} isFrom={comingFrom} />
        <View style={{ marginTop: hp(1), marginBottom: -hp(5) }}>
          <MatchDetailComponent
            date={date}
            month={month}
            matchName={matchName}
            day={day}
            datetime={datetime}
            location={location}
            cost={cost ? "Cost: " + cost : ""}
            age={age ? "Age: " + age : ""}
            gender={gender ? "Gender: " + gender : ""}
            matchLevel={matchLevel}
            message={message}
            gotoMapScreen={() => this.gotoMapScreen()}
          />
        </View>

        {confirmPlayersList.length == 0 ? null : (
          <View
            style={[
              TabStyle.interestedPlayerView,
              {
                flex:
                  interestedPlayersList.length == 0 ||
                  invitedPlayersList.length == 0
                    ? 1
                    : 0.5,
                marginBottom:
                  interestedPlayersList.length == 0 ||
                  invitedPlayersList.length == 0
                    ? 0
                    : hp(1),
              },
            ]}
          >
            <HeadingWithText
              titleText={strings.confirmPlayers}
              marginVerticalview={hp(2)}
            />
            <FlatList
              data={confirmPlayersList}
              renderItem={({ item, index }) =>
                this.renderinterestedPlayersListview(
                  item,
                  index,
                  "ConfirmPlayer"
                )
              }
              bounces={false}
              showsVerticalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate={"fast"}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            />
          </View>
        )}
        {interestedPlayersList.length == 0 ? (
          <View style={TabStyle.emptyview}>
            <Text numberOfLines={2} style={[TabStyle.emptytext]}>
              {strings.nointerestedPlayers}
            </Text>
          </View>
        ) : (
          <View
            style={[
              TabStyle.interestedPlayerView,
              {
                flex:
                  confirmPlayersList.length == 0 ||
                  invitedPlayersList.length == 0
                    ? 1
                    : 0.5,
                marginBottom:
                  confirmPlayersList.length == 0 ||
                  invitedPlayersList.length == 0
                    ? 0
                    : hp(1),
              },
            ]}
          >
            <HeadingWithText
              titleText={strings.interestedPlayers}
              marginVerticalview={hp(2)}
            />
            <FlatList
              data={interestedPlayersList}
              renderItem={({ item, index }) =>
                this.renderinterestedPlayersListview(
                  item,
                  index,
                  "InterestedPlayer"
                )
              }
              bounces={false}
              showsVerticalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate={"fast"}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            />
          </View>
        )}
        {invitedPlayersList.length == 0 ? null : (
          <View
            style={[
              TabStyle.interestedPlayerView,
              {
                flex:
                  confirmPlayersList.length == 0 ||
                  interestedPlayersList.length == 0
                    ? 1
                    : 0.5,
                marginBottom:
                  interestedPlayersList.length == 0 ||
                  confirmPlayersList.length == 0
                    ? 0
                    : hp(1),
              },
            ]}
          >
            <HeadingWithText
              titleText={strings.invitedPlayers}
              marginVerticalview={hp(2)}
            />
            <FlatList
              data={invitedPlayersList}
              renderItem={({ item, index }) =>
                this.renderinterestedPlayersListview(
                  item,
                  index,
                  "InvitedPlayer"
                )
              }
              bounces={false}
              snapToAlignment="start"
              decelerationRate={"fast"}
              showsVerticalScrollIndicator={false}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            />
          </View>
        )}

        {this.props.isBusyGetInterestedPlayerList ||
        this.props.isConfirmAndDeclineMatch ? (
          <Loader />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyGetInterestedPlayerList: state.app.isBusyGetInterestedPlayerList,
    responseBusyGetInterestedPlayerListdata:
      state.app.responseBusyGetInterestedPlayerListdata,
    isConfirmAndDeclineMatch: state.app.isConfirmAndDeclineMatch,
    responseConfirmAndDeclinedata: state.app.responseConfirmAndDeclinedata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    currentUser: state.auth.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doGetInterestedPlayersList,
        doConfirmandDeclineMatch,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchDetailInterestedandConfirmPlayersScreen);
