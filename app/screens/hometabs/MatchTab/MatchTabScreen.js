import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, View, FlatList, Platform, TouchableOpacity } from "react-native";
import images from "../../../resources/images";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import strings from "../../../resources/languages/strings";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as globals from "../../../utils/Globals";
import Colors from "../../../constants/Colors";
import FastImage from "react-native-fast-image";
import CustomTwoSegmentCoponent from "../../../components/buttons/CustomTwoSegmentCoponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeadingWithText from "../../../components/RenderFlatlistComponent/HeadingWithText";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { showErrorMessage, showSuccessMessage } from "../../../utils/helpers";
import Loader from "../../../components/loaders/Loader";
import { doGetUpcomingMatch } from "../../../redux/actions/AppActions";
import { prefEnum } from "../../../resources/constants";
import CustomSlots from "../../../components/buttons/CustomSlots";
import errors from "../../../resources/languages/errors";
import { EventRegister } from "react-native-event-listeners";
import font_type from "../../../resources/fonts";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import MediaModel from "../../../components/modals/MediaModel";
import CustomOnebuttonComponent from "../../../components/buttons/CustomOnebuttonComponent";
import { CommonActions } from "@react-navigation/native";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../utils/metrics";
import { Box, Button, HStack, Image } from "native-base";
import moment from "moment";

class MatchTabScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmedMatchesData: [],
      notificationData: props.notificationData,
      upComingMatchList: [],
      isSelectedTab: "",
      upComingOrCompleted: "upcoming",
      isProfilePicker: false,
      currentUser: {},
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseGetUpcomingMatchdata !== this.props.responseGetUpcomingMatchdata) {
      if (this.props.responseGetUpcomingMatchdata !== undefined) {
        const { success, message, matches, status_code } = this.props.responseGetUpcomingMatchdata;
        if (status_code == 200 && success == true) {
          this.setUpcomingMatchList(matches);
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

    if (prevProps.responseRefreshTokendata !== this.props.responseRefreshTokendata) {
      if (this.props.responseRefreshTokendata !== undefined) {
        const { success, token, message, status_code } = this.props.responseRefreshTokendata;
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
    await this.getApiToken();
    // used as navigation event
    this.getUpcomingMatchList();
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState({ isSelectedTab: "" }, () => {
        this.getUpcomingMatchList();
      });
    });
    this.listener = EventRegister.addEventListener("RefreshMatchList", () => {
      this.getUpcomingMatchList();
    });
    this.listenertwo = EventRegister.addEventListener("initializeApp", () => {
      this.setCurrentUser();
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    EventRegister.removeEventListener(this.listenertwo);
    this._unsubscribe();
  }

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
    });
  };

  doClearStackResetSubScreen(mainScreen, subScreen, navigation) {
    navigation.dispatch(
      CommonActions.navigate({
        name: mainScreen,
        params: { screen: subScreen, from: "notification" },
      })
    );
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  getUpcomingMatchList = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doGetUpcomingMatch();
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setUpcomingMatchList = (matches) => {
    if (matches.completedMatch) {
      this.setState({ confirmedMatchesData: matches.completedMatch });
    }
    if (matches.upcomingMatch) {
      this.setState({ upComingMatchList: matches.upcomingMatch });
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

  gotoDeatilMatch = (item, index) => {
    if (item.is_status == "Invited") {
      this.props.navigation.navigate("MatchDetailUserInvited", {
        matchDetail: item,
      });
    } else if (item.is_status == "Organizer") {
      this.props.navigation.navigate("EditorDeleteMatch", {
        matchDetail: item,
      });
    } else if (item.is_status == "Confirmed") {
      this.props.navigation.navigate("UserConfirmation", {
        matchDetail: item,
      });
    } else if (item.is_status == "final_match") {
      this.props.navigation.navigate("OnlyMatchDetail", {
        matchDetail: item,
      });
    } else if (item.is_status == "Booked Match") {
      // this.props.navigation.navigate("UserConfirmation", {
      //   matchDetail: item,
      // });
    } else if (item.is_status == "rematch") {
      this.props.navigation.navigate("EditMatch", {
        matchDetail: item,
        isFrom: "rematch",
      });
    } else {
      this.props.navigation.navigate("UserRequest", {
        matchDetail: item,
      });
    }
  };

  renderMatchesview = (item, index) => {
    let confirmed_players = [];
    if (item.confirmed_player) {
      confirmed_players = item.confirmed_player.slice(0, 3).map((data, innerindex) => {
        return (
          <>
            <View key={innerindex} style={[TabStyle.plyersimageView]}>
              <Image
                alt="user image"
                source={images.dummy_user_img}
                width={`${hs(30)}px`}
                height={`${hs(30)}px`}
                resizeMode="contain"
                resizeMethod="resize"
                rounded="full"
              />
            </View>
          </>
        );
      });
    }
    return (
      <>
        <TouchableOpacity
          key={index}
          onPress={() => this.gotoDeatilMatch(item, index)}
          style={[
            TabStyle.mainFlatView,
            // { opacity: item.is_status == "Booked Match" ? 0.5 : null },
          ]}
        >
          <View style={[TabStyle.FlatinnerView, { width: wp(13) }]}>
            <Text
              numberOfLines={1}
              style={[
                TabStyle.smalltextview,
                { color: Colors.BLACK, fontSize: ms(15), fontStyle: "italic", lineHeight: ms(18) },
              ]}
            >
              {item.match_month ? item.match_month : ""}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                TabStyle.smalltextview,
                { color: Colors.PRIMARY, lineHeight: ms(18), fontSize: ms(15), fontFamily: font_type.FontBold },
              ]}
            >
              {item.match_date ? item.match_date : ""}
            </Text>
            <Text
              numberOfLines={1}
              style={[TabStyle.dayTimeView, { fontSize: ms(10), lineHeight: ms(18), fontStyle: "italic" }]}
            >
              {item.match_day ? item.match_day : ""}
            </Text>
            <Text numberOfLines={1} style={[TabStyle.dayTimeView, { fontSize: ms(9), lineHeight: ms(18) }]}>
              {item.match_start_at ? moment(item.match_start_at).format("h:mmA") : ""}
            </Text>
          </View>
          <View style={TabStyle.lineView} />
          <View style={{ marginHorizontal: wp(1) }}>
            <HStack space={1} alignItems="center">
              <FastImage
                resizeMode="contain"
                style={{ width: hs(20), height: hs(20) }}
                source={images.tennis_img}
              ></FastImage>
              <Text numberOfLines={1} style={[{ fontSize: hs(20), color: Colors.YELLOW, fontWeight: "400" }]}>
                {item.sport ? item.sport : ""}
              </Text>
              {(item.is_status === "Confirmed" || item.is_status === "Organizer") && (
                <FastImage
                  resizeMode="contain"
                  style={{ width: hs(15), height: hs(15), marginTop: -hs(7.5) }}
                  source={images.confirmed_img}
                ></FastImage>
              )}
            </HStack>
            <View style={{ flexDirection: "row", marginTop: hs(8) }}>
              <FastImage
                resizeMode="contain"
                style={{ width: hs(15), height: hs(15), marginRight: hs(6) }}
                source={images.location_img}
              ></FastImage>
              <Text
                numberOfLines={1}
                style={[TabStyle.smallConfirmplayertext, { color: Colors.GREY, width: "80%", fontSize: ms(12) }]}
              >
                {item.location ? item.location : ""}
              </Text>
            </View>
            <View style={[TabStyle.rowFlexDiretion, { alignItems: "center", marginTop: hs(4) }]}>
              {confirmed_players}

              {confirmed_players.length >= 3 ? (
                <Text numberOfLines={1} style={TabStyle.plyersLimitText}>
                  {item.confirmed_player.length - 3 == 0 ? "" : "+" + " " + (item.confirmed_player.length - 3)}
                </Text>
              ) : null}
              {item.open_sports == 0 ? null : (
                <View style={{ marginHorizontal: wp(1) }}>
                  <Box
                    width="full"
                    rounded="full"
                    height={`${hs(15)}px`}
                    bgColor={Colors.PRIMARY}
                    px={2}
                    _text={{ fontSize: ms(10), margin: 0, color: Colors.WHITE }}
                  >
                    {strings.openSlot + item.open_sports}
                  </Box>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
        {item.is_status ? (
          <View style={[TabStyle.matchesStatusview]}>
            {item.is_status == "final_match" ? (
              <FastImage resizeMode="contain" style={TabStyle.smallIconStyle} source={images.right_img}></FastImage>
            ) : item.is_status == "rematch" ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("EditMatch", {
                    matchDetail: item,
                    isFrom: "rematch",
                  })
                }
              >
                <FastImage resizeMode="contain" style={TabStyle.smallIconStyle} source={images.rematch_img}></FastImage>
              </TouchableOpacity>
            ) : (
              <Text
                numberOfLines={1}
                style={[
                  TabStyle.smallConfirmplayertext,
                  { color: Colors.DARK_GREY, backgroundColor: Colors.WHISPER, fontSize: ms(15) },
                ]}
              >
                {item.is_status ? (item.is_status === "Organizer" ? "Organizer" : "Player") : ""}
              </Text>
            )}
          </View>
        ) : null}
      </>
    );
  };

  gotoSelectedTab = (isSelectedTab) => {
    const { currentUser } = this.state;
    this.setState({ isSelectedTab: isSelectedTab }, () => {
      if (isSelectedTab == "Find_Match") {
        if (parseInt(currentUser.percentage) >= parseInt("50%")) {
          this.props.navigation.navigate("MatchwithFilters");
        } else {
          this.displayProfilePicker();
        }
      } else {
        this.props.navigation.navigate("CreateMatch");
      }
    });
  };

  //display Profile Picker model
  displayProfilePicker = () => {
    this.setState({ isProfilePicker: !this.state.isProfilePicker });
  };

  onNavigateToProfile = () => {
    this.displayProfilePicker();
    this.props.navigation.navigate("EditProfile", { isFrom: "" });
  };

  render() {
    const { isSelectedTab, isProfilePicker, upComingMatchList, confirmedMatchesData, upComingOrCompleted } = this.state;
    const matches = upComingOrCompleted === "upcoming" ? upComingMatchList : confirmedMatchesData;

    return (
      <View style={[TabCommonStyle.container]}>
        <MediaModel modalVisible={isProfilePicker} onBackdropPress={() => this.displayProfilePicker()}>
          <View style={ProfileStyle.modelContainer}>
            <View style={[ProfileStyle.modelView]}>
              <View style={[ProfileStyle.titleviewstyle, {}]}>
                <TouchableOpacity onPress={() => this.displayProfilePicker()} style={TabStyle.closeCalendarPopup}>
                  <FastImage style={[ProfileStyle.calendarimg]} source={images.close_img}></FastImage>
                </TouchableOpacity>
                <View style={TabStyle.alrtview}>
                  <FastImage style={[ProfileStyle.calendarimg]} source={images.alert_red_img}></FastImage>
                  <Text numberOfLines={2} style={[TabStyle.alrtTexts]}>
                    {strings.completeProfileFirst}
                  </Text>
                </View>

                <View style={[TabStyle.calandarPopupView, { marginVertical: hp(1) }]}>
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
        {/* <Header props={this.props} /> */}
        <View style={[TabStyle.container, { marginTop: -hp(1) }]}>
          <HStack width="full" space={4} mt={`${vs(20)}`} mb={`${vs(30)}px`}>
            <Button
              flex={1}
              borderRadius={5}
              borderWidth={1}
              borderColor={Colors.DARK_GREY}
              _text={{ fontStyle: "italic", color: Colors.DARK_GREY }}
              onPress={() => this.gotoSelectedTab("Find_Match")}
            >
              Find a Match
            </Button>
            <Button
              flex={1}
              borderWidth={1}
              borderRadius={5}
              borderColor={Colors.DARK_GREY}
              _text={{ fontStyle: "italic", color: Colors.DARK_GREY }}
              onPress={() => this.gotoSelectedTab("Create_Match")}
            >
              Create a Match
            </Button>
          </HStack>

          <View style={{ flex: confirmedMatchesData.length == 0 ? 1 : 0.7 }}>
            <HeadingWithText titleText={"My Matches"} marginVerticalview={hp(0)} />

            <HStack width="full" space={4} mt={`${vs(20)}`}>
              <Button
                flex={1}
                bgColor={upComingOrCompleted === "upcoming" ? Colors.ORANGE : Colors.WHITE}
                borderWidth={upComingOrCompleted !== "upcoming" ? 1 : 0}
                borderRadius={5}
                borderColor={Colors.DARK_GREY}
                _text={{
                  color: upComingOrCompleted === "upcoming" ? Colors.WHITE : Colors.DARK_GREY,
                  fontStyle: "italic",
                }}
                onPress={() => this.setState({ upComingOrCompleted: "upcoming" })}
              >
                Upcoming
              </Button>
              <Button
                flex={1}
                bgColor={upComingOrCompleted !== "upcoming" ? Colors.ORANGE : Colors.WHITE}
                borderWidth={upComingOrCompleted === "upcoming" ? 1 : 0}
                borderRadius={5}
                borderColor={Colors.DARK_GREY}
                _text={{
                  color: upComingOrCompleted === "completed" ? Colors.WHITE : Colors.DARK_GREY,
                  fontStyle: "italic",
                }}
                onPress={() => this.setState({ upComingOrCompleted: "completed" })}
              >
                Completed
              </Button>
            </HStack>

            {matches.length == 0 ? (
              <Text style={[TabStyle.subtitleview, { marginVertical: hp(2) }]}>{strings.noUpcomingMatches}</Text>
            ) : (
              <FlatList
                style={{ marginVertical: hp(1.5) }}
                data={matches}
                renderItem={({ item, index }) => this.renderMatchesview(item, index)}
                extraData={matches}
                bounces={false}
                showsVerticalScrollIndicator={false}
                listKey={(item, index) => "D" + index.toString()}
                keyExtractor={(item, index) => "D" + index.toString()}
              />
            )}
          </View>
        </View>
        {this.props.isBusyGetUpcomingMatch ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyGetUpcomingMatch: state.app.isBusyGetUpcomingMatch,
    responseGetUpcomingMatchdata: state.app.responseGetUpcomingMatchdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
    notificationData: state.app.notificationData,
    currentUser: state.auth.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doGetUpcomingMatch,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchTabScreen);
