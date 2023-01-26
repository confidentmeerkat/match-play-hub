import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { TouchableOpacity, FlatList, Text, View, Platform } from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Header from "../../../../components/Header/Header";
import Loader from "../../../../components/loaders/Loader";
import { doinvitedPlayerList } from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../utils/helpers";
import errors from "../../../../resources/languages/errors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";
import * as globals from "../../../../utils/Globals";
import images from "../../../../resources/images";
import FastImage from "react-native-fast-image";
import Colors from "../../../../constants/Colors";
import strings from "../../../../resources/languages/strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import Search from "../../../../components/Search/Search";
import Icon from "react-native-vector-icons/AntDesign";
import BackgroundButton from "../../../../components/buttons/BackgroundButton";
import font_type from "../../../../resources/fonts";
import { RFPercentage } from "react-native-responsive-fontsize";
import { EventRegister } from "react-native-event-listeners";
import SearchMessage from "../../../../components/Search/SearchMessage";
import MediaModel from "../../../../components/modals/MediaModel";
import { ProfileStyle } from "../../../../../assets/styles/ProfileStyle";
import CustomOnebuttonComponent from "../../../../components/buttons/CustomOnebuttonComponent";

class InviteFriendsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      invitedPlayers: [],
      location: "",
      crrntLong: 0,
      crrntLat: 0,
      currentPlayersLimit: props.route.params.currentPlayersLimit,
      isFrom: props.route.params.isFrom,
      matchDetail: props.route.params.matchDetail,
      selectedFilters: 0,
      selectedCallbackFiltersData: {},
      locationInfo: {},
      isFilterEnable: 0,
      isProfilePicker: false,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseInvitedPlayerdata !==
      this.props.responseInvitedPlayerdata
    ) {
      if (this.props.responseInvitedPlayerdata !== undefined) {
        const { success, message, status_code, allFriendsUsers, locationInfo } =
          this.props.responseInvitedPlayerdata;
        if (status_code == 200 && success == true) {
          this.setinvitedPlayers(allFriendsUsers, locationInfo);
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
    if (this.props.currentUser !== undefined) {
      this.setCurrentUser();
    }
    this.getApiToken();
    await this.getInvitedPlayers();
    this.listener = EventRegister.addEventListener(
      "addFilters",
      ({ finalReturendObject }) => {
        this.setState(
          {
            selectedCallbackFiltersData: finalReturendObject,
            selectedFilters: this.state.selectedFilters
              ? finalReturendObject.TotalNumberofSearch + 1
              : finalReturendObject.TotalNumberofSearch,
          },
          () => {
            this.getInvitedPlayers();
          }
        );
      }
    );
    this.listenertwo = EventRegister.addEventListener("initializeApp", () => {
      this.setCurrentUser();
    });
    this.listenerthree = EventRegister.addEventListener(
      "RefreshinvitedPlayers",
      () => {
        this.getInvitedPlayers();
      }
    );
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    EventRegister.removeEventListener(this.listenertwo);
    EventRegister.removeEventListener(this.listenerthree);
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
    });
  };

  getInvitedPlayers = async () => {
    const {
      matchDetail,
      crrntLong,
      crrntLat,
      isFrom,
      location,
      isFilterEnable,
      selectedFilters,
      selectedCallbackFiltersData,
    } = this.state;

    if (globals.isInternetConnected == true) {
      const params = {
        match_id: isFrom == "EditMatch" ? matchDetail.id : "",
        latitude: crrntLat,
        longitude: crrntLong,
        location: location,
        gender: selectedCallbackFiltersData.Gender
          ? selectedCallbackFiltersData.Gender
          : "",
        age_preference: selectedCallbackFiltersData.Age
          ? selectedCallbackFiltersData.Age
          : [],
        distance: selectedCallbackFiltersData.Distance
          ? selectedCallbackFiltersData.Distance
          : "",
        level: selectedCallbackFiltersData.Level
          ? selectedCallbackFiltersData.Level
          : "",
        sport: selectedCallbackFiltersData.Sport
          ? selectedCallbackFiltersData.Sport
          : [],
        is_filter: selectedFilters != 0 ? 1 : isFilterEnable,
      };
      this.props.doinvitedPlayerList(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setinvitedPlayers = (allFriendsUsers, locationInfo) => {
    this.setState({
      invitedPlayers: allFriendsUsers ? allFriendsUsers : [],
      locationInfo: locationInfo ? locationInfo : {},
      selectedFilters: locationInfo ? locationInfo.count : 0,
      isFilterEnable: locationInfo ? locationInfo.is_filter : 0,
    });
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

  isIconCheckedOrNot = (item, index) => {
    let { invitedPlayers } = this.state;

    invitedPlayers.map((innerItem, innerIndex) => {
      if (index == innerIndex) {
        innerItem.isChecked = !innerItem.isChecked;
      }
    });
    this.setState({ invitedPlayers }, () => {
      this.forceUpdate();
    });
  };

  renderInvitedPlayersview = (item, index) => {
    let sportsData = [];
    if (item.assign_sport) {
      sportsData = item.assign_sport.map((data, index, sportsData) => {
        return (
          <Text key={index} numberOfLines={1} style={[TabStyle.smalltextview]}>
            {data.title + "(" + data.status + ")"}
            {index != sportsData.length - 1 ? ", " : ""}
          </Text>
        );
      });
    }
    return (
      <View key={index} style={[TabStyle.interestedPlayermainFlatvew]}>
        <TouchableOpacity
          style={[
            TabStyle.rowFlexDiretion,
            {
              width: "65%",
              marginRight: wp(20),
              alignItems: "center",
            },
          ]}
          onPress={() => this.gotoDetailofPlayer(item, index)}
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

          <View style={{ marginHorizontal: wp(1) }}></View>

          <View style={{ width: "65%" }}>
            <Text
              numberOfLines={1}
              style={[TabStyle.headertext, { width: "70%" }]}
            >
              {item.username ? item.username : ""}
            </Text>
            {item.gender || item.age ? (
              <Text
                numberOfLines={1}
                style={[TabStyle.smalltextview, { width: "70%" }]}
              >
                {item.gender ? item.gender : ""} {item.age ? item.age : ""}
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
                  style={[TabStyle.smalltextview, { width: "70%" }]}
                >
                  {item.location ? item.location : ""}
                </Text>
              </View>
            ) : null}
            {sportsData.length > 2 ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: wp(30) }} numberOfLines={1}>
                  {sportsData}
                </Text>
                <Text
                  style={{ width: wp(40), color: Colors.ORANGE }}
                  numberOfLines={1}
                >
                  {"+" + sportsData.length + " Sports"}
                </Text>
              </View>
            ) : (
              <Text style={{ width: wp(60) }} numberOfLines={2}>
                {sportsData}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.isIconCheckedOrNot(item, index)}
          style={[
            TabStyle.smallCheckbox,
            {
              backgroundColor: item.isChecked ? Colors.PRIMARY : Colors.WHITE,
            },
          ]}
        >
          {item.isChecked ? (
            <Icon
              style={{ textAlign: "center" }}
              name="check"
              color={Colors.WHITE}
              size={globals.deviceWidth * 0.05}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  gotoDetailofPlayer = (item, index) => {
    this.props.navigation.navigate("AllConnectionDetail", {
      other_user_info: item,
    });
  };

  doClickInvitePlayerandcontinue = () => {
    const { currentPlayersLimit, invitedPlayers } = this.state;
    let currentID;
    if (invitedPlayers) {
      var selectedItem = invitedPlayers.filter((item) => {
        return item.isChecked;
      });
      currentID = selectedItem.map((item) => {
        return item.id;
      });
    }
    // if (currentPlayersLimit < selectedItem.length) {
    //   showErrorMessage(
    //     "You can not invite more than" +
    //       " " +
    //       currentPlayersLimit +
    //       " " +
    //       "Players"
    //   );
    //   return;
    // }
    const { navigation } = this.props;
    navigation.goBack();
    this.props.route.params.PlayersLimit(currentID);
  };

  handleOnLocationSelect = (details) => {
    if (details) {
      if (
        details.geometry != undefined &&
        details.geometry.location != undefined &&
        details.formatted_address != undefined
      ) {
        this.setState(
          {
            crrntLat: details.geometry.location.lat,
            crrntLong: details.geometry.location.lng,
            location: details.formatted_address,
            selectedFilters: this.state.selectedFilters + 1,
          },
          () => {
            this.getInvitedPlayers();
          }
        );
      }
    }
  };

  //display Profile Picker model
  displayProfilePicker = () => {
    this.setState({ isProfilePicker: !this.state.isProfilePicker });
  };

  onNavigateToProfile = () => {
    this.displayProfilePicker();
    this.props.navigation.navigate("EditProfile", { isFrom: "" });
  };

  gotoSearchFilter = () => {
    const { selectedCallbackFiltersData, currentUser } = this.state;
    if (parseInt(currentUser.percentage) >= parseInt("50%")) {
      let finalObject = {
        gender: selectedCallbackFiltersData.Gender
          ? selectedCallbackFiltersData.Gender
          : "",
        age: selectedCallbackFiltersData.Age
          ? selectedCallbackFiltersData.Age
          : "",
        location_radius: selectedCallbackFiltersData.Distance
          ? selectedCallbackFiltersData.Distance
          : "",
        skill_level: selectedCallbackFiltersData.Level
          ? selectedCallbackFiltersData.Level
          : "",
        sports: selectedCallbackFiltersData.Sport
          ? selectedCallbackFiltersData.Sport
          : "",
      };
      this.props.navigation.navigate("SearchFilters", {
        props: this.props,
        finalObject: finalObject,
      });
    } else {
      this.displayProfilePicker();
    }
  };

  onChangeTexttoRemove = (text) => {
    this.setState({ location: text });
  };

  clearFilters = () => {
    this.setState(
      {
        location: "",
        crrntLong: 0,
        crrntLat: 0,
        selectedFilters: 0,
        selectedCallbackFiltersData: {},
        isFilterEnable: 0,
      },
      () => {
        this.getInvitedPlayers();
      }
    );
  };

  render() {
    const {
      invitedPlayers,
      isProfilePicker,
      isFilterEnable,
      locationInfo,
      selectedFilters,
      location,
    } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <MediaModel
          modalVisible={isProfilePicker}
          onBackdropPress={() => this.displayProfilePicker()}
        >
          <View style={ProfileStyle.modelContainer}>
            <View style={[ProfileStyle.modelView]}>
              <View style={[ProfileStyle.titleviewstyle, {}]}>
                <TouchableOpacity
                  onPress={() => this.displayProfilePicker()}
                  style={TabStyle.closeCalendarPopup}
                >
                  <FastImage
                    style={[ProfileStyle.calendarimg]}
                    source={images.close_img}
                  ></FastImage>
                </TouchableOpacity>
                <View style={TabStyle.alrtview}>
                  <FastImage
                    style={[ProfileStyle.calendarimg]}
                    source={images.alert_red_img}
                  ></FastImage>
                  <Text numberOfLines={2} style={[TabStyle.alrtTexts]}>
                    {strings.completeProfileFirst}
                  </Text>
                </View>
                <View
                  style={[
                    TabStyle.calandarPopupView,
                    { marginVertical: hp(1) },
                  ]}
                >
                  <CustomOnebuttonComponent
                    segmentOneTitle={strings.gotoProfile}
                    segmentOneImage={images.home_img}
                    segmentOneTintColor={Colors.PRIMARY}
                    onPressSegmentOne={() => this.onNavigateToProfile()}
                  />
                </View>
              </View>
            </View>
          </View>
        </MediaModel>
        <Header isHideBack props={this.props} />
        <View
          style={[
            TabStyle.marginfromallside,
            TabStyle.onlyFlex,
            { marginVertical: 0 },
          ]}
        >
          {isFilterEnable == 0 && invitedPlayers.length == 0 ? (
            <View style={TabStyle.emptyview}>
              <Text numberOfLines={2} style={TabStyle.emptytext}>
                {strings.createConnection}
              </Text>
            </View>
          ) : (
            <>
              <Search
                placeholder={strings.enter_location}
                handletextInputProps={{
                  value: location,
                  placeholderTextColor: Colors.BLACK,
                  onChangeText: (text) => {
                    this.onChangeTexttoRemove(text);
                  },
                }}
                onFilter={() => this.gotoSearchFilter()}
                handleOnLocationSelect={(data, details = null) => {
                  this.handleOnLocationSelect(details);
                }}
                selectedFilters={selectedFilters}
              />
              {isFilterEnable == 0 && invitedPlayers.length == 0 ? (
                <View style={TabStyle.emptyview}>
                  <Text numberOfLines={2} style={TabStyle.emptytext}>
                    {strings.createConnection}
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: hp(2) }}>
                  <SearchMessage
                    titleText={locationInfo.stringMessage}
                    isClearFilter={selectedFilters == 0 ? false : true}
                    clearFilters={() => this.clearFilters()}
                  />
                </View>
              )}
              {invitedPlayers.length > 0 ? (
                <>
                  <View style={[TabStyle.onlyFlex, { marginVertical: hp(2) }]}>
                    <FlatList
                      data={invitedPlayers}
                      renderItem={({ item, index }) =>
                        this.renderInvitedPlayersview(item, index)
                      }
                      bounces={false}
                      showsVerticalScrollIndicator={false}
                      listKey={(item, index) => "D" + index.toString()}
                      keyExtractor={(item, index) => "D" + index.toString()}
                    />
                  </View>
                  <View
                    style={[
                      TabStyle.invitedfrndsListView,
                      { marginBottom: hp(2) },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => this.doClickInvitePlayerandcontinue()}
                    >
                      <BackgroundButton
                        title={strings.invitePlayerandcontinue}
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
                </>
              ) : null}
            </>
          )}
        </View>
        {this.props.isBusyInvitedPlayer ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyInvitedPlayer: state.app.isBusyInvitedPlayer,
    responseInvitedPlayerdata: state.app.responseInvitedPlayerdata,
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
        doinvitedPlayerList,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteFriendsScreen);
