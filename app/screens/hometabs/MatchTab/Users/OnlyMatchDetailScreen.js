import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Header from "../../../../components/Header/Header";
import strings from "../../../../resources/languages/strings";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import images from "../../../../resources/images";
import MatchDetailComponent from "../../../../components/RenderFlatlistComponent/MatchDetailComponent";
import CustomOnebuttonComponent from "../../../../components/buttons/CustomOnebuttonComponent";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as AddCalendarEvent from "react-native-add-calendar-event";
import moment from "moment";
import MediaModel from "../../../../components/modals/MediaModel";
import { ProfileStyle } from "../../../../../assets/styles/ProfileStyle";
import Colors from "../../../../constants/Colors";
import FastImage from "react-native-fast-image";
import { EventRegister } from "react-native-event-listeners";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../utils/helpers";
import { doSentFriendRequest } from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import * as globals from "../../../../utils/Globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";
import errors from "../../../../resources/languages/errors";
import { bindActionCreators } from "redux";

class OnlyMatchDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmedPlayersList: [],
      matchDetail: props.route.params.matchDetail,
      organizer: [],
      isCalandarPicker: false,
      isOrganizer: false,
      comingFrom: "",
      currentUser: props.currentUser,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseSentFriendRequestdata !==
      this.props.responseSentFriendRequestdata
    ) {
      if (this.props.responseSentFriendRequestdata !== undefined) {
        const { success, message, status_code } =
          this.props.responseSentFriendRequestdata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          EventRegister.emit("refreshPlayersList");
          EventRegister.emit("RefreshMatchList");
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
    await this.updateMatchDetails();
  }

  componentWillUnmount() {}

  updateMatchDetails = () => {
    const { matchDetail, currentUser } = this.state;
    this.setState(
      {
        organizer: matchDetail.Organizer,
        confirmedPlayersList: matchDetail.confirmed_player,
      },
      () => {
        if (currentUser.id == this.state.organizer.user_id) {
          this.setState({ isOrganizer: true });
        }
      }
    );
  };

  gotoonMatchClick = () => {
    this.displayCalandarPicker();
  };

  gotoOrganizerMessage = () => {
    this.props.navigation.navigate("ChatDetail", {
      other_user_info_Id: this.state.organizer.user_id,
      isFrom: "WithoutFilter",
    });
  };

  onPresssendRequest = async () => {
    const { organizer } = this.state;

    if (globals.isInternetConnected == true) {
      let param = {
        receiver_id: organizer.user_id,
      };
      this.props.doSentFriendRequest(param);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  onPressmanageRequest = async () => {
    this.props.navigation.navigate("PLAY", { isfrom: "manageRequest" });
  };

  //display Calandar Picker model
  displayCalandarPicker = () => {
    this.setState({ isCalandarPicker: !this.state.isCalandarPicker });
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

  utcDateToString = (momentInUTC) => {
    if (Platform.OS == "android") {
      let platformwiseDateFormated = moment(momentInUTC)
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      return platformwiseDateFormated;
    } else {
      let platformwiseDateFormated = moment(momentInUTC).format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
      return platformwiseDateFormated;
    }
  };

  onClickAddtoCalendar = () => {
    const { matchDetail } = this.state;
    const eventConfig = {
      title: matchDetail.sport ? matchDetail.sport : "",
      startDate: matchDetail.formated_start_date
        ? this.utcDateToString(matchDetail.formated_start_date)
        : "",
      endDate: matchDetail.formated_end_date
        ? this.utcDateToString(matchDetail.formated_end_date)
        : "",
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(({ calendarItemIdentifier, eventIdentifier }) => {
        if (
          calendarItemIdentifier != undefined &&
          eventIdentifier != undefined
        ) {
        }
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error);
        this.displayCalandarPicker();
        showErrorMessage(errors.allowCalendarPermission);
      });
  };

  gotoMapScreen = () => {
    this.props.navigation.navigate("MapView", {
      matchDetail: this.state.matchDetail,
    });
  };

  render() {
    const {
      isOrganizer,
      matchDetail,
      organizer,
      isCalandarPicker,
      confirmedPlayersList,
      comingFrom,
    } = this.state;

    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} isFrom={comingFrom} />
        <View style={[TabStyle.dropdownmargins]} />
        <MediaModel
          modalVisible={isCalandarPicker}
          onBackdropPress={() => this.displayCalandarPicker()}
        >
          <View style={ProfileStyle.modelContainer}>
            <View style={[ProfileStyle.modelView]}>
              <View
                style={[ProfileStyle.titleviewstyle, { marginVertical: hp(1) }]}
              >
                <TouchableOpacity
                  onPress={() => this.displayCalandarPicker()}
                  style={TabStyle.closeCalendarPopup}
                >
                  <FastImage
                    style={[ProfileStyle.calendarimg]}
                    source={images.close_img}
                  ></FastImage>
                </TouchableOpacity>
                <View style={{ marginBottom: -hp(5), marginTop: hp(1) }}>
                  <MatchDetailComponent
                    date={matchDetail.match_date ? matchDetail.match_date : ""}
                    month={
                      matchDetail.match_month ? matchDetail.match_month : ""
                    }
                    matchLevel={matchDetail.level ? matchDetail.level : ""}
                    matchName={matchDetail.sport ? matchDetail.sport : ""}
                    datetime={
                      matchDetail.match_time ? matchDetail.match_time : ""
                    }
                    day={matchDetail.match_day ? matchDetail.match_day : ""}
                    location={matchDetail.location ? matchDetail.location : ""}
                  />
                </View>

                <View
                  style={[
                    TabStyle.calandarPopupView,
                    { marginVertical: hp(1) },
                  ]}
                >
                  <CustomOnebuttonComponent
                    segmentOneTitle={strings.addtoCalander}
                    segmentOneImage={images.calander_img}
                    segmentOneTintColor={Colors.PRIMARY}
                    onPressSegmentOne={() => this.onClickAddtoCalendar()}
                  />
                </View>
              </View>
            </View>
          </View>
        </MediaModel>
        <MatchDetailComponent
          date={matchDetail.match_date ? matchDetail.match_date : ""}
          month={matchDetail.match_month ? matchDetail.match_month : ""}
          matchName={matchDetail.sport ? matchDetail.sport : ""}
          matchLevel={matchDetail.level ? matchDetail.level : ""}
          datetime={matchDetail.match_time ? matchDetail.match_time : ""}
          day={matchDetail.match_day ? matchDetail.match_day : ""}
          location={matchDetail.location ? matchDetail.location : ""}
          cost={matchDetail.cost ? "Cost: " + matchDetail.cost : ""}
          age={matchDetail.age_string ? "Age: " + matchDetail.age_string : ""}
          gender={
            matchDetail.gender_string
              ? "Gender: " + matchDetail.gender_string
              : ""
          }
          message={matchDetail.message ? matchDetail.message : ""}
          firstheadingtitle={strings.confirmPlayers}
          firstheadingdata={confirmedPlayersList}
          secondheadingtitle={strings.openSlot}
          secondheadingdata={
            matchDetail.open_sports ? matchDetail.open_sports : ""
          }
          organizertitle={strings.organizer}
          organizerImage={
            organizer.profile_url === "" || organizer.profile_url === undefined
              ? images.dummy_user_img
              : { uri: organizer.profile_url }
          }
          isOrganizer={isOrganizer}
          organizerUsername={organizer.username ? organizer.username : ""}
          organizerGender={organizer.gender ? organizer.gender : ""}
          organizerAgePreference={organizer.age ? organizer.age : ""}
          organizerLocation={organizer.location ? organizer.location : ""}
          organizerMessages={strings.messageOrganizer}
          gotoMapScreen={() => this.gotoMapScreen()}
          onMatchClick={() => this.gotoonMatchClick()}
          onPressSegmentOne={() => this.gotoOrganizerMessage()}
          is_request={matchDetail.is_request}
          is_friend={matchDetail.is_friend}
          is_receive_request={matchDetail.is_receive_request}
          onPressmanageRequest={() => this.onPressmanageRequest()}
          onPresssendRequest={() => this.onPresssendRequest()}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    currentUser: state.auth.currentUser,
    isBusySentFriendRequest: state.app.isBusySentFriendRequest,
    responseSentFriendRequestdata: state.app.responseSentFriendRequestdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doSentFriendRequest,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnlyMatchDetailScreen);
