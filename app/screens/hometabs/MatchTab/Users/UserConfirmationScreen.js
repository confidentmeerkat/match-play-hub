import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { View, Platform } from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Header from "../../../../components/Header/Header";
import strings from "../../../../resources/languages/strings";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";
import errors from "../../../../resources/languages/errors";
import Loader from "../../../../components/loaders/Loader";
import images from "../../../../resources/images";
import MatchDetailComponent from "../../../../components/RenderFlatlistComponent/MatchDetailComponent";
import CustomOnebuttonComponent from "../../../../components/buttons/CustomOnebuttonComponent";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  doSentFriendRequest,
  doConfirmandDeclineMatch,
} from "../../../../redux/actions/AppActions";
import * as globals from "../../../../utils/Globals";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../utils/helpers";
import { EventRegister } from "react-native-event-listeners";

class UserConfirmationScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmedPlayersList: [],
      matchDetail: props.route.params.matchDetail,
      organizer: [],
      currentUser: {},
      isOrganizer: false,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseConfirmAndDeclinedata !==
      this.props.responseConfirmAndDeclinedata
    ) {
      if (this.props.responseConfirmAndDeclinedata !== undefined) {
        const { success, message, status_code } =
          this.props.responseConfirmAndDeclinedata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
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
            showErrorMessage(message);
          }
        }
      }
    }

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
    await this.updateMatchDetails();
  }

  componentWillUnmount() {}

  updateMatchDetails = () => {
    if (this.props.currentUser !== undefined) {
      this.setState({
        currentUser: this.props.currentUser,
      });
    }
    const { matchDetail } = this.state;
    this.setState(
      {
        organizer: matchDetail.Organizer,
        confirmedPlayersList: matchDetail.confirmed_player,
      },
      () => {
        if (this.props.currentUser.id == this.state.organizer.user_id) {
          this.setState({ isOrganizer: true });
        }
      }
    );
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

  onClickCancleConfirmation = async (status) => {
    const { matchDetail, currentUser } = this.state;

    if (globals.isInternetConnected == true) {
      const params = {
        match_id: matchDetail.id,
        user_id: currentUser.id,
        status: "decline",
      };
      this.props.doConfirmandDeclineMatch(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoMapScreen = () => {
    this.props.navigation.navigate("MapView", {
      matchDetail: this.state.matchDetail,
    });
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

  render() {
    const { isOrganizer, matchDetail, organizer, confirmedPlayersList } =
      this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View
          style={[
            TabStyle.dropdownmargins,
            { marginVertical: hp(3), marginTop: hp(1) },
          ]}
        >
          <CustomOnebuttonComponent
            segmentOneTitle={strings.cancleConfirmation}
            segmentOneImage={images.close_img}
            onPressSegmentOne={() => this.onClickCancleConfirmation()}
          />
        </View>
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
          organizerUsername={organizer.username ? organizer.username : ""}
          organizerGender={organizer.gender ? organizer.gender : ""}
          organizerAgePreference={organizer.age ? organizer.age : ""}
          isOrganizer={isOrganizer}
          organizerLocation={organizer.location ? organizer.location : ""}
          organizerMessages={strings.messageOrganizer}
          gotoMapScreen={() => this.gotoMapScreen()}
          onPressSegmentOne={() => this.gotoOrganizerMessage()}
          is_request={matchDetail.is_request}
          is_friend={matchDetail.is_friend}
          is_receive_request={matchDetail.is_receive_request}
          onPressmanageRequest={() => this.onPressmanageRequest()}
          onPresssendRequest={() => this.onPresssendRequest()}
        />
        {this.props.isConfirmAndDeclineMatch ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isConfirmAndDeclineMatch: state.app.isConfirmAndDeclineMatch,
    responseConfirmAndDeclinedata: state.app.responseConfirmAndDeclinedata,
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
        doConfirmandDeclineMatch,
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
)(UserConfirmationScreen);
