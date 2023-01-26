import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, TouchableOpacity, View, FlatList, Platform } from "react-native";
import { prefEnum } from "../../../resources/constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import images from "../../../resources/images";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import strings from "../../../resources/languages/strings";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as globals from "../../../utils/Globals";
import Colors from "../../../constants/Colors";
import BarcodeScreen from "./BarcodeScreen";
import { getBarcodeSubKind } from "../../../constants/Barcode_helper";
import HeadingWithText from "../../../components/RenderFlatlistComponent/HeadingWithText";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import CustomOnebuttonComponent from "../../../components/buttons/CustomOnebuttonComponent";
import HoriZontalFlatList from "../../../components/RenderFlatlistComponent/HoriZontalFlatList";
import {
  doGetUserUpcomingMatch,
  doFindMatch,
} from "../../../redux/actions/AppActions";
import { showSuccessMessage, showErrorMessage } from "../../../utils/helpers";
import Loader from "../../../components/loaders/Loader";
import CustomSlots from "../../../components/buttons/CustomSlots";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { EventRegister } from "react-native-event-listeners";
import font_type from "../../../resources/fonts";
import MediaModel from "../../../components/modals/MediaModel";

class HubTabScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      username:
        props.currentUser !== undefined ? props.currentUser.username : "",
      gender: props.currentUser !== undefined ? props.currentUser.gender : "",
      photoUrl:
        props.currentUser !== undefined ? props.currentUser.profile_url : "",
      age: props.currentUser !== undefined ? props.currentUser.age : "",
      barcodeData: "",
      qr_url: props.currentUser !== undefined ? props.currentUser.qr_url : "",
      upcomingMatchesList: [],
      playerMatches: [],
      newMessages: [],
      location:
        props.currentUser !== undefined && props.currentUser.location
          ? props.currentUser.city + ", " + props.currentUser.state
          : "",
      percentage:
        props.currentUser !== undefined ? props.currentUser.percentage : "",
      isProfilePicker: false,
      notificationData: props.notificationData,
      filteredmatchData: [],
      locationInfo: [],
      searchData: [],
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseFindMatchdata !== this.props.responseFindMatchdata) {
      if (this.props.responseFindMatchdata !== undefined) {
        const {
          success,
          searchData,
          message,
          matchData,
          locationInfo,
          status_code,
        } = this.props.responseFindMatchdata;
        if (status_code == 200 && success == true) {
          if (matchData) {
            this.setFindmatchsData(matchData, locationInfo, searchData);
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
          } else if (status_code == 400 || status_code == 422) {
            showErrorMessage(message);
          } else {
          }
        }
      }
    }
    if (
      prevProps.responseGetUserUpcomingMatchdata !==
      this.props.responseGetUserUpcomingMatchdata
    ) {
      if (this.props.responseGetUserUpcomingMatchdata !== undefined) {
        const {
          success,
          message,
          finalMatchData,
          message_request,
          player_request,
          status_code,
        } = this.props.responseGetUserUpcomingMatchdata;
        if (status_code == 200 && success == true) {
          this.setuserUpcomingMatchList(
            finalMatchData,
            message_request,
            player_request
          );
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
    this.getApiToken();
    this.getUpcomingMatchList();
    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      await this.getUpcomingMatchList();
    });
    if (this.state.currentUser !== undefined) {
      this.setCurrentUser();
    }
    this.listener = EventRegister.addEventListener("initializeApp", () => {
      this.setCurrentUser();
    });
    this.listenerone = EventRegister.addEventListener(
      "RefreshMatchList",
      async () => {
        await this.getUpcomingMatchList();
      }
    );
    this.getFindMatchList();
  }

  componentWillUnmount() {
    this._unsubscribe();
    EventRegister.removeEventListener(this.listener);
    EventRegister.removeEventListener(this.listenerone);
  }

  getUpcomingMatchList = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doGetUserUpcomingMatch();
    } else {
      // showErrorMessage(errors.no_internet);
    }
  };

  getFindMatchList = () => {
    const { currentUser } = this.state;
    let formattedAge;
    if (currentUser.age_preference.length > 0) {
      var data = JSON.parse(currentUser.age_preference);
      var b = JSON.stringify(data);
      formattedAge = b.replace(/\\/g, "");
    }
    if (globals.isInternetConnected == true) {
      const params = {
        match_dates: [],
        match_time: [0, 86399],
        sport: currentUser.assignSportCategory
          ? JSON.stringify(currentUser.assignSportCategory)
          : [],
        level: [],
        selectedLevel: [],
        player_limit: "",
        gender: currentUser.gender
          ? JSON.stringify(currentUser.gender_json)
          : "",
        age_preference: currentUser.age_preference,
        distance: currentUser.distance ? currentUser.distance : "",
        cost: "",
        latitude: currentUser.latitude ? currentUser.latitude : "",
        longitude: currentUser.longitude ? currentUser.longitude : "",
        location: currentUser.location ? currentUser.location : "",
        start_time: "",
        end_time: "",
        is_filter: 0,
      };
      this.props.doFindMatch(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setuserUpcomingMatchList(finalMatchData, message_request, player_request) {
    this.setState({
      upcomingMatchesList: finalMatchData,
      playerMatches: player_request,
      newMessages: message_request,
    });
  }

  setFindmatchsData = (matchData, locationInfo, searchData) => {
    this.setState({
      filteredmatchData: matchData,
      locationInfo: locationInfo,
      searchData: searchData,
    });
  };

  setCurrentUser = () => {
    this.setState(
      {
        currentUser: this.props.currentUser,
      },
      () => {
        this.setUserInfo();
      }
    );
  };

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  setUserInfo = () => {
    const { currentUser } = this.state;
    this.setState({
      username:
        this.props.currentUser !== undefined ? currentUser.username : "",
      gender: this.props.currentUser !== undefined ? currentUser.gender : "",
      photoUrl:
        this.props.currentUser !== undefined ? currentUser.profile_url : "",
      age: this.props.currentUser !== undefined ? currentUser.age : "",
      qr_url: this.props.currentUser !== undefined ? currentUser.qr_url : "",
      location: currentUser.location
        ? currentUser.city + ", " + currentUser.state
        : "",
      percentage:
        this.props.currentUser !== undefined ? currentUser.percentage : "",
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

  doClickSettings = () => {
    this.props.navigation.navigate("Setting");
  };

  doClickEditProfile = () => {
    this.props.navigation.navigate("MyProfile");
  };

  gotoSetting = () => {
    this.props.navigation.navigate("Setting");
  };

  doClickQRCodeScanner = () => {
    this.props.navigation.navigate("GenrateQrCode", {
      qr_url: this.state.qr_url,
    });
  };

  getBarcode(barcodeData) {
    this.setState({
      barcodeData: barcodeData.data,
    });
    this._barCodeView.show(false);
  }

  gotoFindMatch = () => {
    const { currentUser, filteredmatchData, locationInfo, searchData } =
      this.state;
    if (parseInt(currentUser.percentage) >= parseInt("50%")) {
      // this.props.navigation.navigate("MatchwithFilters");
      this.props.navigation.navigate("MatchWithListing", {
        filteredmatchData: this.state.filteredmatchData,
        locationInfo: this.state.locationInfo,
        searchData: this.state.searchData,
      });
    } else {
      this.displayProfilePicker();
    }
  };

  //display Profile Picker model
  displayProfilePicker = () => {
    this.setState({ isProfilePicker: !this.state.isProfilePicker });
  };

  gotoMessages = () => {
    this.props.navigation.navigate("ChatListing");
  };

  gotoPlayerRequest = () => {
    this.props.navigation.navigate("PLAY");
  };

  gotoDeatilMatch = (item, index) => {
    if (item.is_status == "Organizer") {
      this.props.navigation.navigate("EditorDeleteMatch", {
        matchDetail: item,
      });
    } else if (item.is_status == "Confirmed") {
      this.props.navigation.navigate("UserConfirmation", {
        matchDetail: item,
      });
    }
  };

  renderMatchesview = (item, index) => {
    let confirmed_players = [];
    if (item.confirmed_player) {
      confirmed_players = item.confirmed_player
        .slice(0, 5)
        .map((data, innerindex) => {
          return (
            <View key={innerindex} style={TabStyle.plyersimageView}>
              <FastImage
                style={TabStyle.plyersImageStyle}
                source={
                  data.profile_url === ""
                    ? images.dummy_user_img
                    : { uri: data.profile_url }
                }
              ></FastImage>
            </View>
          );
        });
    }
    return (
      <View style={{ marginHorizontal: wp(5), flex: 0.3 }}>
        <TouchableOpacity
          key={index}
          onPress={() => this.gotoDeatilMatch(item, index)}
          style={[TabStyle.mainFlatView]}
        >
          <View style={[TabStyle.FlatinnerView, { width: wp(13) }]}>
            <Text
              numberOfLines={1}
              style={[
                TabStyle.smalltextview,
                { color: Colors.PRIMARY, fontFamily: font_type.FontExtraBold },
              ]}
            >
              {item.match_month ? item.match_month : ""}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                TabStyle.smalltextview,
                { color: Colors.PRIMARY, fontFamily: font_type.FontExtraBold },
              ]}
            >
              {item.match_date ? item.match_date : ""}
            </Text>
            <Text numberOfLines={1} style={[TabStyle.dayTimeView]}>
              {item.match_day ? item.match_day : ""}
            </Text>
            <Text numberOfLines={1} style={[TabStyle.dayTimeView]}>
              {item.match_time ? item.match_time : ""}
            </Text>
          </View>
          <View style={TabStyle.lineView} />
          <View style={{ marginHorizontal: wp(1) }}>
            <Text numberOfLines={1} style={[TabStyle.headertext]}>
              {item.sport ? item.sport : ""}
            </Text>
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
                  style={[
                    TabStyle.smallConfirmplayertext,
                    { color: Colors.GREY, width: "80%" },
                  ]}
                >
                  {item.location ? item.location : ""}
                </Text>
              </View>
            ) : null}

            <View style={[TabStyle.rowFlexDiretion, { alignItems: "center" }]}>
              {confirmed_players}
              {confirmed_players.length >= 5 ? (
                <Text numberOfLines={1} style={TabStyle.plyersLimitText}>
                  {item.confirmed_player.length - 5 == 0
                    ? ""
                    : "+" + " " + (item.confirmed_player.length - 5)}
                </Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderListHeaderComponent = () => {
    const {
      currentUser,
      username,
      location,
      upcomingMatchesList,
      gender,
      photoUrl,
      age,
      percentage,
    } = this.state;

    return (
      <>
        <HeadingWithText
          titleText={strings.myprofile}
          marginVerticalview={hp(1.5)}
          marginLeftview={wp(3)}
        />
        <BarcodeScreen
          ref={(r) => (this._barCodeView = r)}
          subKind={getBarcodeSubKind()}
          getBarcode={(data) => this.getBarcode(data)}
        />
        <View style={[ProfileStyle.innercontainer, { marginTop: hp(1) }]}>
          <View style={[ProfileStyle.profilecontainer]}>
            <View style={ProfileStyle.start_view}>
              <TouchableOpacity onPress={() => this.doClickQRCodeScanner()}>
                <FastImage
                  resizeMethod="resize"
                  style={ProfileStyle.qrcodestyle}
                  source={images.qr_code_img}
                ></FastImage>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => this.doClickEditProfile()}
            >
              <View style={ProfileStyle.middle_view}>
                <FastImage
                  resizeMethod="resize"
                  style={ProfileStyle.imageStyle}
                  source={
                    photoUrl === "" ? images.dummy_user_img : { uri: photoUrl }
                  }
                ></FastImage>
              </View>

              <CustomSlots titleText={percentage + " " + "COMPLETE"} />
              {/* <TouchableOpacity onPress={() => this.doClickEditProfile()}>
                <FastImage
                  style={[ProfileStyle.qrcodestyle]}
                  source={images.edit_profile_img}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity> */}
            </TouchableOpacity>

            <View style={ProfileStyle.last_endview}>
              <TouchableOpacity onPress={() => this.gotoSetting()}>
                <FastImage
                  style={[ProfileStyle.settingsiconstyle]}
                  source={images.settings_img}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => this.doClickEditProfile()}>
                <FastImage
                  style={[ProfileStyle.qrcodestyle, { marginVertical: hp(2) }]}
                  source={images.profile_img}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        <View style={[ProfileStyle.middlecontainer, { marginBottom: hp(1) }]}>
          <Text numberOfLines={1} style={ProfileStyle.headertext}>
            {username}
          </Text>

          {gender || age ? (
            <Text numberOfLines={1} style={ProfileStyle.smalltextview}>
              {gender ? gender + " " : ""} {age ? age : ""}
            </Text>
          ) : null}

          {location ? (
            <View style={{ flexDirection: "row" }}>
              <FastImage
                resizeMode="contain"
                tintColor={Colors.GREY}
                style={ProfileStyle.locationicon}
                source={images.fill_location_img}
              ></FastImage>
              <Text numberOfLines={1} style={ProfileStyle.smalltextview}>
                {location}
              </Text>
            </View>
          ) : null}
        </View>
        <HeadingWithText
          titleText={strings.myMatches}
          marginVerticalview={hp(1.5)}
          marginLeftview={wp(3)}
        />

        {upcomingMatchesList.length == 0 ? (
          <View style={[TabStyle.container, { marginHorizontal: wp(5) }]}>
            <Text style={[ProfileStyle.subtitleview, { marginBottom: hp(2) }]}>
              {strings.noMatches}
            </Text>
            <CustomOnebuttonComponent
              segmentOneTitle={strings.findMatch}
              segmentOneImage={images.find_img}
              segmentOneTintColor={Colors.PRIMARY}
              onPressSegmentOne={() => this.gotoFindMatch()}
            />
          </View>
        ) : null}
      </>
    );
  };

  renderListFooterComponent = () => {
    const { playerMatches, newMessages } = this.state;
    return (
      <>
        <HeadingWithText
          titleText={strings.playerRequestTitle}
          marginVerticalview={hp(1.5)}
          marginLeftview={wp(3)}
        />
        <View style={[TabStyle.container]}>
          {playerMatches.length == 0 ? (
            <View>
              <Text
                style={[ProfileStyle.subtitleview, { marginBottom: hp(2) }]}
              >
                {strings.noPlayerRequests}
              </Text>
              <CustomOnebuttonComponent
                segmentOneTitle={strings.playerRequest}
                segmentOneImage={images.adduser_img}
                segmentOneTintColor={Colors.PRIMARY}
                onPressSegmentOne={() => this.gotoPlayerRequest()}
              />
            </View>
          ) : (
            <HoriZontalFlatList
              data={playerMatches}
              isFrom={"hubPlayerRequest"}
              navigation={this.props}
            />
          )}
        </View>
        <HeadingWithText
          titleText={strings.newMessages}
          marginVerticalview={hp(1.5)}
          marginLeftview={wp(3)}
        />
        <View style={[TabStyle.container]}>
          {newMessages.length == 0 ? (
            <>
              <Text
                style={[ProfileStyle.subtitleview, { marginBottom: hp(2) }]}
              >
                {strings.noNewMessages}
              </Text>
              <CustomOnebuttonComponent
                segmentOneTitle={strings.gotomsg}
                segmentOneImage={images.avatar_img}
                onPressSegmentOne={() => this.gotoMessages()}
              />
            </>
          ) : (
            <>
              <View style={{ marginBottom: hp(2) }}>
                <HoriZontalFlatList
                  data={newMessages}
                  isFrom={"hubMessageRequest"}
                  navigation={this.props}
                />
              </View>
            </>
          )}
        </View>
      </>
    );
  };

  onNavigateToProfile = () => {
    this.displayProfilePicker();
    this.props.navigation.navigate("EditProfile", { isFrom: "" });
  };

  render() {
    const { isProfilePicker, upcomingMatchesList } = this.state;
    return (
      <View style={[ProfileStyle.container]}>
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
        <View style={[ProfileStyle.container, { marginBottom: hp(3) }]}>
          <FlatList
            data={upcomingMatchesList}
            extraData={upcomingMatchesList}
            renderItem={({ item, index }) =>
              this.renderMatchesview(item, index)
            }
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => "D" + index.toString()}
            listKey={(item, index) => "D" + index.toString()}
            ListHeaderComponent={this.renderListHeaderComponent()}
            ListFooterComponent={this.renderListFooterComponent()}
          />
        </View>

        {this.props.isBusyGetUserUpcomingMatch ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyFindMatch: state.app.isBusyFindMatch,
    responseFindMatchdata: state.app.responseFindMatchdata,
    currentUser: state.auth.currentUser,
    isBusyGetUserUpcomingMatch: state.app.isBusyGetUserUpcomingMatch,
    responseGetUserUpcomingMatchdata:
      state.app.responseGetUserUpcomingMatchdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      { doFindMatch, doGetUserUpcomingMatch, doRefreshToken },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HubTabScreen);
