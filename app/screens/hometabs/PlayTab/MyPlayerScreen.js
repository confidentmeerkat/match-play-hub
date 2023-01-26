import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, Platform, TouchableOpacity, FlatList, View } from "react-native";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import strings from "../../../resources/languages/strings";
import Search from "../../../components/Search/Search";
import images from "../../../resources/images";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import { AlphabetList } from "react-native-section-alphabet-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import Colors from "../../../constants/Colors";
import errors from "../../../resources/languages/errors";
import { showSuccessMessage, showErrorMessage } from "../../../utils/helpers";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { doGetAllConnection } from "../../../redux/actions/AppActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../resources/constants";
import Loader from "../../../components/loaders/Loader";
import * as globals from "../../../utils/Globals";
import HeadingWithText from "../../../components/RenderFlatlistComponent/HeadingWithText";
import { EventRegister } from "react-native-event-listeners";
import SearchMessage from "../../../components/Search/SearchMessage";
import MediaModel from "../../../components/modals/MediaModel";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import CustomOnebuttonComponent from "../../../components/buttons/CustomOnebuttonComponent";

class MyPlayerScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      location: "",
      crrntLong: 0,
      crrntLat: 0,
      pendingConnectionData: [],
      allConnectionData: [],
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
      prevProps.responseGetAllConnectiondata !==
      this.props.responseGetAllConnectiondata
    ) {
      if (this.props.responseGetAllConnectiondata !== undefined) {
        const {
          success,
          message,
          status_code,
          allPendingUsers,
          allFriendsUsers,
          locationInfo,
        } = this.props.responseGetAllConnectiondata;

        if (status_code == 200 && success == true) {
          this.setAllConnectionData(
            allPendingUsers,
            allFriendsUsers,
            locationInfo
          );
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            this.clearUserData();
            this.props.props.navigation.navigate("AuthLoading");
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
            this.props.props.navigation.navigate("AuthLoading");
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
    this.getAllConnection();
    this.listener = EventRegister.addEventListener(
      "refreshPendingConnection",
      () => {
        this.getAllConnection();
      }
    );
    this.listenerone = EventRegister.addEventListener(
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
            this.getAllConnection();
          }
        );
      }
    );
    this.listenertwo = EventRegister.addEventListener("initializeApp", () => {
      this.setCurrentUser();
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    EventRegister.removeEventListener(this.listenerone);
    EventRegister.removeEventListener(this.listenertwo);
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  getAllConnection = async () => {
    const {
      crrntLat,
      selectedFilters,
      isFilterEnable,
      crrntLong,
      selectedCallbackFiltersData,
      location,
    } = this.state;

    if (globals.isInternetConnected == true) {
      const params = {
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
      this.props.doGetAllConnection(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setAllConnectionData = (allPendingUsers, allFriendsUsers, locationInfo) => {
    this.setState({
      pendingConnectionData: allPendingUsers ? allPendingUsers : [],
      allConnectionData: allFriendsUsers ? allFriendsUsers : [],
      locationInfo: locationInfo ? locationInfo : {},
      selectedFilters: locationInfo ? locationInfo.count : 0,
      isFilterEnable: locationInfo ? locationInfo.is_filter : 0,
    });
  };

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
    });
  };

  gotoDetailofPendingReuestPlayer = (item, index) => {
    this.props.props.navigation.navigate("PendingConnectionDetail", {
      other_user_info: item,
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

  gotoDetailofPlayer = (item, index) => {
    this.props.props.navigation.navigate("AllConnectionDetail", {
      other_user_info: item,
    });
  };

  renderPendingConnectionview = (item, index, isFrom) => {
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
      <TouchableOpacity
        key={index}
        onPress={() =>
          isFrom == "Pending_reuest"
            ? this.gotoDetailofPendingReuestPlayer(item, index)
            : this.gotoDetailofPlayer(item, index)
        }
        style={[
          TabStyle.mainBottomFlatView,
          { paddingHorizontal: 0, marginVertical: 0 },
        ]}
      >
        <View style={[TabStyle.FlatinnerView, {}]}>
          <FastImage
            style={TabStyle.userImg}
            source={
              item.profile_url === ""
                ? images.dummy_user_img
                : { uri: item.profile_url }
            }
          ></FastImage>
        </View>
        {isFrom == "Pending_reuest" ? (
          <View style={TabStyle.dotView}></View>
        ) : (
          <View style={{ marginHorizontal: wp(1) }}></View>
        )}

        <View>
          <Text numberOfLines={1} style={[TabStyle.headertext]}>
            {item.username ? item.username : ""}
          </Text>
          {item.gender || item.age ? (
            <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
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
              <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
                {item.location ? item.location : ""}
              </Text>
            </View>
          ) : null}
          {sportsData.length > 2 ? (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ width: wp(40) }} numberOfLines={1}>
                {sportsData}
              </Text>
              <Text
                style={{ width: wp(60), color: Colors.ORANGE }}
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
    );
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
            this.getAllConnection();
          }
        );
      }
    }
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
      this.props.props.navigation.navigate("SearchFilters", {
        props: this.props,
        finalObject: finalObject,
      });
    } else {
      this.displayProfilePicker();
    }
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
        this.getAllConnection();
      }
    );
  };

  //display Profile Picker model
  displayProfilePicker = () => {
    this.setState({ isProfilePicker: !this.state.isProfilePicker });
  };

  onChangeTexttoRemove = (text) => {
    this.setState({ location: text });
  };

  onNavigateToProfile = () => {
    this.displayProfilePicker();
    this.props.props.navigation.navigate("EditProfile");
  };

  render() {
    const {
      allConnectionData,
      locationInfo,
      selectedFilters,
      pendingConnectionData,
      isFilterEnable,
      isProfilePicker,
      location,
    } = this.state;
    return (
      <>
        <View style={[TabCommonStyle.container]}>
          <View style={TabStyle.onlyFlex}>
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

            {isFilterEnable == 0 &&
            pendingConnectionData.length == 0 &&
            allConnectionData.length == 0 ? (
              <View style={TabStyle.emptyview}>
                <Text numberOfLines={2} style={TabStyle.emptytext}>
                  {strings.noplyerRequest}
                </Text>
              </View>
            ) : (
              <>
                <Search
                  placeholder={strings.enter_location}
                  onFilter={() => this.gotoSearchFilter()}
                  handletextInputProps={{
                    value: location,
                    placeholderTextColor: Colors.BLACK,
                    onChangeText: (text) => {
                      this.onChangeTexttoRemove(text);
                    },
                  }}
                  handleOnLocationSelect={(data, details = null) => {
                    this.handleOnLocationSelect(details);
                  }}
                  selectedFilters={selectedFilters}
                />
                {isFilterEnable == 0 &&
                pendingConnectionData.length == 0 &&
                allConnectionData.length == 0 ? (
                  <View style={[TabStyle.emptyview, {}]}>
                    <Text numberOfLines={2} style={TabStyle.emptytext}>
                      {strings.noplyerRequest}
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
                {pendingConnectionData.length > 0 ? (
                  <View
                    style={{ flex: allConnectionData.length == 0 ? 1 : 0.8 }}
                  >
                    <HeadingWithText
                      titleText={strings.playerRequestTitle}
                      marginVerticalview={hp(3)}
                    />

                    <FlatList
                      data={pendingConnectionData}
                      renderItem={({ item, index }) =>
                        this.renderPendingConnectionview(
                          item,
                          index,
                          "Pending_reuest"
                        )
                      }
                      bounces={false}
                      showsVerticalScrollIndicator={false}
                      listKey={(item, index) => "D" + index.toString()}
                      keyExtractor={(item, index) => "D" + index.toString()}
                    />
                  </View>
                ) : null}
                {allConnectionData.length > 0 || isFilterEnable == 0 ? (
                  <View
                    style={[
                      TabStyle.sectionlistingView,
                      { flex: allConnectionData.length == 0 ? 0.2 : 1 },
                    ]}
                  >
                    <AlphabetList
                      data={allConnectionData}
                      renderCustomItem={(item, index) =>
                        this.renderPendingConnectionview(item, index)
                      }
                      showsVerticalScrollIndicator={false}
                      indexLetterStyle={{ color: Colors.PRIMARY }}
                      renderCustomSectionHeader={(section) => (
                        <View style={TabStyle.sectionTitleView}>
                          <Text style={TabStyle.smalltextview}>
                            {section.title}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                ) : (
                  <View style={TabStyle.emptyview}>
                    <Text numberOfLines={2} style={TabStyle.emptytext}>
                      {strings.noplyerRequest}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
        {this.props.isBusyGetAllConnection ? <Loader isFrom="Play" /> : null}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyGetAllConnection: state.app.isBusyGetAllConnection,
    responseGetAllConnectiondata: state.app.responseGetAllConnectiondata,
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
        doGetAllConnection,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPlayerScreen);
