import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, TouchableOpacity, View, FlatList, Platform } from "react-native";
import * as globals from "../../../../utils/Globals";
import images from "../../../../resources/images";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../utils/helpers";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../../../constants/Colors";
import FastImage from "react-native-fast-image";
import HeadingWithText from "../../../../components/RenderFlatlistComponent/HeadingWithText";
import strings from "../../../../resources/languages/strings";
import { ProfileStyle } from "../../../../../assets/styles/ProfileStyle";
import CustomSlots from "../../../../components/buttons/CustomSlots";
import font_type from "../../../../resources/fonts";
import { EventRegister } from "react-native-event-listeners";
import Search from "../../../../components/Search/Search";
import SearchMessage from "../../../../components/Search/SearchMessage";
import {
  doFindMatch,
} from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import errors from "../../../../resources/languages/errors";

class ListViewMatchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredmatchData: props.filteredmatchData ? props.filteredmatchData : [],
      locationInfo: props.locationInfo ? props.locationInfo : {},
      searchData: props.searchData ? props.searchData : [],
      location: props.searchData.location ? props.searchData.location : "",
      crrntLong: props.searchData.crrntLong ? props.searchData.crrntLong : "",
      crrntLat: props.searchData.crrntLat ? props.searchData.crrntLat : "",
      selectedcount: props.locationInfo ? props.locationInfo.count : "",
      selectedFilters: props.locationInfo ? props.locationInfo.count : 0,
      isFilterEnable: props.locationInfo ? props.locationInfo.is_filter : 0,
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
            this.setFilterdMatchlist(matchData, locationInfo, searchData);
          } else {
          }
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            this.clearUserData();
            this.props.props.navigation.navigate("AuthLoading");
          } else if (status_code == 500) {
            showErrorMessage(strings.somethingWrong);
          } else if (status_code == 400) {
            showErrorMessage(message);
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
    this.getApiToken();
    this.listenerone = EventRegister.addEventListener(
      "RefreshMatchList",
      async () => {
        await this.doClickFindMatchtoNavigate();
      }
    );
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listenerone);
  }

  setFilterdMatchlist = (matchData, locationInfo, searchData) => {
    this.setState({
      filteredmatchData: matchData,
      locationInfo: locationInfo,
      searchData: searchData,
      selectedcount: locationInfo.count,
      selectedFilters: locationInfo ? locationInfo.count : 0,
      isFilterEnable: locationInfo ? locationInfo.is_filter : 0,
    });
  };

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
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
          },
          () => {
            this.doClickFindMatchtoNavigate();
          }
        );
      }
    }
  };

  clearUserData = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === "android") {
        await AsyncStorage.clear();
      }
      if (Platform.OS === "ios") {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
  };

  gotoMatchDeatil = (item, index) => {
    if (item.is_status == "Invited") {
      this.props.props.navigation.navigate("MatchDetailUserInvited", {
        matchDetail: item,
      });
    } else if (item.is_status == "Organizer") {
      this.props.props.navigation.navigate("EditorDeleteMatch", {
        matchDetail: item,
      });
    } else if (item.is_status == "Confirmed") {
      this.props.props.navigation.navigate("UserConfirmation", {
        matchDetail: item,
      });
    } else if (item.is_status == "final_match") {
      this.props.props.navigation.navigate("OnlyMatchDetail", {
        matchDetail: item,
      });
    } else if (item.is_status == "Booked Match") {
      // this.props.props.navigation.navigate("UserConfirmation", {
      //   matchDetail: item,
      // });
    } else if (item.is_status == "rematch") {
      this.props.props.navigation.navigate("CompletedMatch", {
        matchDetail: item,
      });
    } else {
      this.props.props.navigation.navigate("UserRequest", {
        matchDetail: item,
      });
    }
  };

  renderlistofMatchesDataview = (item, index) => {
    var OrganizerData = item.Organizer;
    return (
      <>
        <TouchableOpacity
          key={index}
          onPress={() => this.gotoMatchDeatil(item, index)}
          style={[
            TabStyle.horizontalMatchFlatView,
            { marginHorizontal: index == 0 ? wp(1) : wp(3.5) },
          ]}
        >
          <View style={TabStyle.submatchview}>
            <View>
              <Text
                numberOfLines={1}
                style={[
                  TabStyle.smalltextview,
                  {
                    textAlign: "center",
                    color: Colors.PRIMARY,
                    fontFamily: font_type.FontExtraBold,
                  },
                ]}
              >
                {item.match_month ? item.match_month : ""}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  TabStyle.smalltextview,
                  {
                    color: Colors.PRIMARY,
                    fontFamily: font_type.FontExtraBold,
                  },
                ]}
              >
                {item.match_date ? item.match_date : ""}
              </Text>
            </View>
            <View style={TabStyle.lineView} />
            <View>
              <Text numberOfLines={1} style={[TabStyle.headertext]}>
                {item.sport ? item.sport : ""}
              </Text>
              <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
                {item.match_day ? item.match_day + ", " : ""}
                {item.match_time ? item.match_time : ""}
              </Text>
            </View>
          </View>
          <View style={TabStyle.locationMatchView}>
            {item.location ? (
              <View style={TabStyle.rowFlexDiretion}>
                <FastImage
                  resizeMode="contain"
                  tintColor={Colors.GREY}
                  style={[ProfileStyle.locationicon, { marginTop: 1 }]}
                  source={images.fill_location_img}
                ></FastImage>
                <Text
                  numberOfLines={1}
                  style={[TabStyle.smalltextview, { width: wp(55) }]}
                >
                  {item.location ? item.location : ""}
                </Text>
              </View>
            ) : null}

            <View style={TabStyle.slotsView}>
              <CustomSlots titleText={strings.openSlot + item.open_sports} />
              <CustomSlots
                customstyle={TabStyle.secondSlotStyle}
                titleText={strings.confirmSlots + item.confirmed}
              />
            </View>
          </View>

          <HeadingWithText
            titleText={strings.organizer}
            marginVerticalview={hp(1)}
            bigcontainerstyle={{ width: globals.deviceWidth * 0.6 }}
          />
          <View style={TabStyle.organizerview}>
            <View style={ProfileStyle.middle_view}>
              <FastImage
                resizeMethod="resize"
                style={TabStyle.imageStyle}
                source={
                  OrganizerData.profile_url === ""
                    ? images.dummy_user_img
                    : { uri: OrganizerData.profile_url }
                }
              ></FastImage>
            </View>
            <View style={[{ marginLeft: wp(5) }]}>
              <Text numberOfLines={1} style={ProfileStyle.headertext}>
                {OrganizerData.username ? OrganizerData.username : "-"}
              </Text>
              {OrganizerData.gender ? (
                <Text numberOfLines={1} style={ProfileStyle.smalltextview}>
                  {OrganizerData.gender ? OrganizerData.gender : ""}{" "}
                  {OrganizerData.age ? OrganizerData.age : ""}
                </Text>
              ) : null}

              {OrganizerData.location ? (
                <View style={{ flexDirection: "row" }}>
                  <FastImage
                    resizeMode="contain"
                    tintColor={Colors.GREY}
                    style={[ProfileStyle.locationicon, { marginTop: 1 }]}
                    source={images.fill_location_img}
                  ></FastImage>

                  <Text numberOfLines={1} style={ProfileStyle.smalltextview}>
                    {OrganizerData.location ? OrganizerData.location : ""}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  onChangeTexttoRemove = (text) => {
    if (
      this.state.location == this.props.searchData.location &&
      text.trim() == ""
    ) {
      this.setState({ location: this.props.searchData.location });
    } else {
      this.setState({ location: "" }, () => {
        if (text.trim() === "") {
          this.setState({ location: "" });
        } else {
          this.setState({ location: text });
        }
      });
    }
    // this.setState({ location: text });
  };

  clearFilters = () => {
    this.setState(
      {
        location: "",
        crrntLong: 0,
        crrntLat: 0,
        selectedcount: 0,
        filteredmatchData: [],
        locationInfo: [],
        searchData: [],
        selectedFilters: 0,
        isFilterEnable: 0,
      },
      () => {
        this.doClickFindMatchtoNavigate();
      }
    );
  };

  doClickFindMatchtoNavigate = async () => {
    const { searchData, selectedFilters, isFilterEnable } = this.state;

    if (globals.isInternetConnected == true) {
      const params = {
        match_dates:
          searchData && searchData.match_dates ? searchData.match_dates : {},
        match_time:
          searchData && searchData.match_time ? searchData.match_time : [],
        sport: searchData && searchData.sport ? searchData.sport : "[]",
        level: searchData && searchData.level ? searchData.level : [],
        selectedLevel:
          searchData && searchData.selectedLevel
            ? searchData.selectedLevel
            : [],
        player_limit:
          searchData && searchData.player_limit ? searchData.player_limit : "",
        gender: searchData && searchData.gender ? searchData.gender : "",
        age_preference:
          searchData && searchData.age_preference
            ? searchData.age_preference
            : "[]",
        distance:
          searchData && searchData.distance
            ? searchData.distance.replace(/[^0-9]/g, "")
            : "",
        cost: searchData && searchData.cost ? searchData.cost : "",
        latitude: this.state.crrntLat
          ? this.state.crrntLat
          : searchData && searchData.latitude
          ? searchData.latitude
          : "",
        longitude: this.state.crrntLong
          ? this.state.crrntLong
          : searchData && searchData.longitude
          ? searchData.longitude
          : "",
        location: this.state.location
          ? this.state.location
          : searchData && searchData.location
          ? searchData.location
          : "",
        is_filter: selectedFilters != 0 ? 1 : isFilterEnable,
      };
      this.props.doFindMatch(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoSearchFilter = () => {
    this.props.props.navigation.navigate("MatchwithFilters");
    EventRegister.emit("RefreshMatchFilter", {
      finalObject: this.state.searchData,
    });
  };

  render() {
    const {
      selectedFilters,
      filteredmatchData,
      location,
      locationInfo,
      selectedcount,
      isFilterEnable,
    } = this.state;
    return (
      <View style={[TabStyle.container]}>
        <Search
          placeholder={location ? location : strings.enter_location}
          onFilter={() => this.gotoSearchFilter()}
          handletextInputProps={{
            value: location,
            placeholderTextColor: Colors.BLACK,
            onChangeText: (text) => {
              this.onChangeTexttoRemove(text);
            },
            // clearButtonMode: "never",
          }}
          handleOnLocationSelect={(data, details = null) => {
            this.handleOnLocationSelect(details);
          }}
          selectedFilters={selectedFilters}
        />

        <View style={{ marginTop: hp(2) }}>
          <SearchMessage
            titleText={locationInfo.stringMessage}
            isClearFilter={selectedFilters == 0 ? false : true}
            clearFilters={() => this.clearFilters()}
          />
        </View>

        {isFilterEnable == 0 && filteredmatchData.length == 0 && !locationInfo.stringMessage ? (
          <>
            <View style={TabStyle.emptyview}>
              <Text numberOfLines={2} style={TabStyle.emptytext}>
                {strings.nomatchfound}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View
              style={[
                { marginBottom: hp(1), marginLeft: -6, marginTop: hp(2) },
              ]}
            >
              <FlatList
                data={filteredmatchData}
                renderItem={({ item, index }) =>
                  this.renderlistofMatchesDataview(item, index)
                }
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                extraData={filteredmatchData}
                showsVerticalScrollIndicator={false}
                listKey={(item, index) => "D" + index.toString()}
                keyExtractor={(item, index) => "D" + index.toString()}
              />
            </View>
          </>
        )}
        {/* {this.props.isBusyFindMatch ? <Loader /> : null} */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyFindMatch: state.app.isBusyFindMatch,
    responseFindMatchdata: state.app.responseFindMatchdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doFindMatch,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListViewMatchScreen);
