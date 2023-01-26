import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  Text,
  Platform,
  View,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import strings from "../../../resources/languages/strings";
import Search from "../../../components/Search/Search";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import FastImage from "react-native-fast-image";
import Colors from "../../../constants/Colors";
import images from "../../../resources/images";
import errors from "../../../resources/languages/errors";
import { showSuccessMessage, showErrorMessage } from "../../../utils/helpers";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { doGetAllUsers } from "../../../redux/actions/AppActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../resources/constants";
import Loader from "../../../components/loaders/Loader";
import * as globals from "../../../utils/Globals";
import { EventRegister } from "react-native-event-listeners";
import SearchMessage from "../../../components/Search/SearchMessage";
import MediaModel from "../../../components/modals/MediaModel";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import CustomOnebuttonComponent from "../../../components/buttons/CustomOnebuttonComponent";
class FindPlayerScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      location: this.props.currentUser ? this.props.currentUser.location : "",
      crrntLong: this.props.currentUser ? this.props.currentUser.longitude : 0,
      crrntLat: this.props.currentUser ? this.props.currentUser.latitude : 0,
      selectedFilters: 0,
      selectedCallbackFiltersData: {},
      findplayersData: [],
      locationInfo: {},
      isFilterEnable: 0,
      isProfilePicker: this.props.currentUser.location == "" ? true : false,
      location_long_name: "",
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseGetAllUsersdata !== this.props.responseGetAllUsersdata
    ) {
      if (this.props.responseGetAllUsersdata !== undefined) {
        const { success, message, status_code, userData, locationInfo } =
          this.props.responseGetAllUsersdata;
        if (status_code == 200 && success == true) {
          this.setAllConnectionData(userData, locationInfo);
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
            this.props.props.navigation.navigate("AuthLoading");
          } else {
          }
        }
      }
    }
  }

  async componentDidMount() {
    if (this.props.currentUser !== undefined) {
      await this.setCurrentUser();
    }
    this.getApiToken();
    await this.getAllPlayers();

    this.listener = EventRegister.addEventListener("refreshPlayersList", () => {
      this.getAllPlayers();
    });
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
            this.getAllPlayers();
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

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
      location: this.props.currentUser.location,
      crrntLong: this.props.currentUser.longitude,
      crrntLat: this.props.currentUser.latitude,
      isProfilePicker: this.props.currentUser.location == "" ? true : false,
    });
  };

  getAllPlayers = async () => {
    const {
      crrntLat,
      isFilterEnable,
      crrntLong,
      selectedCallbackFiltersData,
      location,
      selectedFilters,
      location_long_name,
    } = this.state;

    if (globals.isInternetConnected == true) {
      Keyboard.dismiss();
      const params = {
        latitude: crrntLat,
        longitude: crrntLong,
        location: location,
        location_long_name: location_long_name,
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
      this.props.doGetAllUsers(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setAllConnectionData = (userData, locationInfo) => {
    this.setState({
      findplayersData: userData ? userData : [],
      locationInfo: locationInfo ? locationInfo : {},
      selectedFilters: locationInfo ? locationInfo.count : 0,
      isFilterEnable: locationInfo ? locationInfo.is_filter : 0,
    });
  };

  gotoDetailofPlayer = (item, index) => {
    this.props.props.navigation.navigate("PlayerDetail", {
      other_user_info: item,
    });
  };

  renderfindplayersDataview = (item, index) => {
    let sportsData = [];
    if (item.assign_sport) {
      sportsData = item.assign_sport.map((data, index, sportsData) => {
        return (
          <Text key={index} numberOfLines={2} style={[TabStyle.smalltextview]}>
            {data.title + "(" + data.status + ")"}
            {index != sportsData.length - 1 ? ", " : ""}
          </Text>
        );
      });
    }
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.gotoDetailofPlayer(item, index)}
        style={TabStyle.horizontalFlatView}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <FastImage
            resizeMethod="resize"
            style={[TabStyle.imageStyle]}
            source={
              item.profile_url === ""
                ? images.dummy_user_img
                : { uri: item.profile_url }
            }
          ></FastImage>
          <Text
            numberOfLines={1}
            style={[TabStyle.headertext, { marginVertical: hp(2.5) }]}
          >
            {item.username ? item.username : ""}
          </Text>

          <View style={{ flexDirection: "row" }}>
            {item.location ? (
              <FastImage
                tintColor={Colors.GREY}
                style={TabStyle.verysmallIcon}
                source={images.fill_location_img}
              ></FastImage>
            ) : null}

            <Text
              numberOfLines={1}
              style={[TabStyle.smalltextview, { marginBottom: hp(0.5) }]}
            >
              {item.location ? item.location : ""}
            </Text>
          </View>
        </View>
        <View style={TabStyle.horizontalView} />
        <View>
          <Text numberOfLines={1} style={[TabStyle.headertext]}>
            {strings.sportLevel}
          </Text>

          {sportsData.length > 2 ? (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[TabStyle.singleSports, { marginVertical: hp(1) }]}
                numberOfLines={1}
              >
                {sportsData}
              </Text>
              <Text style={TabStyle.multipleSports} numberOfLines={1}>
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
            location_long_name: details.address_components.long_name,
            selectedFilters: this.state.selectedFilters + 1,
          },
          () => {
            this.getAllPlayers();
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
        location: this.props.currentUser.location,
        crrntLong: this.props.currentUser.longitude,
        crrntLat: this.props.currentUser.latitude,
        selectedFilters: 0,
        selectedCallbackFiltersData: {},
        isFilterEnable: 0,
      },
      () => {
        this.getAllPlayers();
      }
    );
  };

  //display Profile Picker model
  displayProfilePicker = () => {
    if (this.props.currentUser.location == "") {
      this.setState({ isProfilePicker: true });
    } else {
      this.setState({ isProfilePicker: false });
    }
  };

  onNavigateToProfile = () => {
    this.setState({ isProfilePicker: false });
    this.props.props.navigation.navigate("EditProfile", {
      isFrom: this.props.currentUser.location == "" ? "FindPlayer" : "",
    });
  };

  onChangeTexttoRemove = (text) => {
    if (
      this.state.location == this.props.currentUser.location &&
      text.trim() == ""
    ) {
      this.setState({ location: this.props.currentUser.location });
    } else {
      this.setState({ location: "" }, () => {
        if (text.trim() === "") {
          this.setState({ location: "" });
        } else {
          this.setState({ location: text });
        }
      });
    }
  };

  render() {
    const {
      findplayersData,
      isProfilePicker,
      isFilterEnable,
      locationInfo,
      selectedFilters,
      location,
    } = this.state;
    return (
      <>
        <MediaModel
          modalVisible={isProfilePicker}
          onBackdropPress={() => this.displayProfilePicker()}
        >
          <View style={ProfileStyle.modelContainer}>
            <View style={[ProfileStyle.modelView]}>
              <View style={[ProfileStyle.titleviewstyle, {}]}>
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

        {isFilterEnable == 0 && findplayersData.length == 0 ? (
          <View style={TabStyle.emptyview}>
            <Text numberOfLines={2} style={TabStyle.emptytext}>
              {strings.noplayerfound}
            </Text>
          </View>
        ) : (
          <>
            <Search
              placeholder={location}
              handletextInputProps={{
                value: location,
                placeholderTextColor: Colors.BLACK,
                onChangeText: (text) => {
                  this.onChangeTexttoRemove(text);
                },
                clearButtonMode: "never",
              }}
              onFilter={() => this.gotoSearchFilter()}
              handleOnLocationSelect={(data, details = null) => {
                this.handleOnLocationSelect(details);
              }}
              selectedFilters={selectedFilters}
            />
            {isFilterEnable == 0 && findplayersData.length == 0 ? (
              <View style={TabStyle.emptyview}>
                <Text numberOfLines={2} style={TabStyle.emptytext}>
                  {strings.nomatchingplayer}
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
          </>
        )}

        {findplayersData.length == 0 && isFilterEnable == 1 ? (
          <View style={TabStyle.emptyview}>
            <Text numberOfLines={2} style={TabStyle.emptytext}>
              {strings.nomatchingplayer}
            </Text>
          </View>
        ) : (
          <View>
            <FlatList
              style={{ marginVertical: hp(2) }}
              data={findplayersData}
              renderItem={({ item, index }) =>
                this.renderfindplayersDataview(item, index)
              }
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              showsVerticalScrollIndicator={false}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            />
          </View>
        )}
        {this.props.isBusyGetAllUsersRequest ? <Loader isFrom="Play" /> : null}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyGetAllUsersRequest: state.app.isBusyGetAllUsersRequest,
    responseGetAllUsersdata: state.app.responseGetAllUsersdata,
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
        doGetAllUsers,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FindPlayerScreen);
