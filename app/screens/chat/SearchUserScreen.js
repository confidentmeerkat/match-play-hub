import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  FlatList,
  Text,
  View,
  Platform,
} from "react-native";
import { TabCommonStyle } from "../../../assets/styles/TabCommonStyle";
import Header from "../../components/Header/Header";
import Loader from "../../components/loaders/Loader";
import { doPostSearchUsers } from "../../redux/actions/ChatActions";
import { doRefreshToken } from "../../redux/actions/AuthActions";
import { showSuccessMessage, showErrorMessage } from "../../utils/helpers";
import errors from "../../resources/languages/errors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import * as globals from "../../utils/Globals";
import images from "../../resources/images";
import FastImage from "react-native-fast-image";
import Colors from "../../constants/Colors";
import strings from "../../resources/languages/strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TabStyle } from "../../../assets/styles/TabStyle";
import SearchByName from "../../components/Search/SearchByName";

class SearchUserScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      allUsers: [],
      searchTxt: "",
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseSearchUsers !== this.props.responseSearchUsers) {
      if (this.props.responseSearchUsers !== undefined) {
        const {
          success,
          message,
          error,
          allFriendsUsers,
          locationInfo,
          status_code,
        } = this.props.responseSearchUsers;
        if (status_code == 200 && success == true) {
          this.setAllUserData(allFriendsUsers, locationInfo);
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === "android") {
                AsyncStorage.clear();
              }
              if (Platform.OS === "ios") {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
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
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === "android") {
                AsyncStorage.clear();
              }
              if (Platform.OS === "ios") {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
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
    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      this.getAllUsersList();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  getAllUsersList = async () => {
    if (globals.isInternetConnected == true) {
      let params = {
        username: this.state.searchTxt,
      };
      this.props.doPostSearchUsers(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setAllUserData = (allFriendsUsers, locationInfo) => {
    this.setState({
      allUsers: allFriendsUsers,
      locationInfo: locationInfo,
    });
  };

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
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

  renderallUsersview = (item, index) => {
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
      <View key={index} style={TabStyle.interestedPlayermainFlatvew}>
        <TouchableOpacity
          style={[
            TabStyle.rowFlexDiretion,
            { width: "85%", alignItems: "center" },
          ]}
          onPress={() => this.gotoDetailofPlayer(item, index)}
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

          <View style={{ marginHorizontal: wp(1) }}></View>

          <View>
            <Text
              numberOfLines={1}
              style={[TabStyle.headertext, { width: "70%" }]}
            >
              {item.username ? item.username : ""}
            </Text>
            {item.gender ? (
              <Text
                numberOfLines={1}
                style={[TabStyle.smalltextview, { width: "70%" }]}
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
                  style={[TabStyle.smalltextview, { width: "70%" }]}
                >
                  {item.location ? item.location : ""}
                </Text>
              </View>
            ) : null}
            {sportsData.length > 2 ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ width: wp(43) }} numberOfLines={1}>
                  {sportsData}
                </Text>
                <Text
                  style={{ width: wp(43), color: Colors.ORANGE }}
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
      </View>
    );
  };

  gotoDetailofPlayer = (item, index) => {
    this.props.navigation.navigate("ChatDetail", {
      other_user_info_Id: item.id,
      isFrom: "WithoutFilter",
    });
  };

  onNavigateToProfile = () => {
    this.displayProfilePicker();
    this.props.navigation.navigate("EditProfile", { isFrom: "" });
  };

  gotoSearchFilter = () => {};

  clearFilters = () => {
    this.setState(
      {
        location: strings.enter_location,
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

  searchByName(searchText) {
    this.setState({ searchTxt: searchText }, () => {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        this.getAllUsersList();
      }, 500);
    });
  }

  clickononFilter = () => {
    this.props.navigation.navigate("ChatSearchFilter");
  };

  render() {
    const {
      allUsers,
      searchTxt,
      isFilterEnable,
      locationInfo,
      selectedFilters,
    } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} headerText={"Search Users"} />
        <View
          style={[
            TabStyle.marginfromallside,
            TabStyle.onlyFlex,
            { marginVertical: hp(1) },
          ]}
        >
          <SearchByName
            blurOnSubmit={false}
            value={searchTxt}
            returnKeyType="done"
            autoCapitalize={"none"}
            onChangeText={this.searchByName.bind(this)}
            placeholderText={strings.search}
            onFilter={() => this.clickononFilter()}
          />
          {allUsers.length == 0 ? (
            <View style={TabStyle.emptyview}>
              <Text numberOfLines={2} style={TabStyle.emptytext}>
                {strings.noChatist}
              </Text>
            </View>
          ) : (
            <>
              <View style={[TabStyle.onlyFlex, { marginVertical: hp(2) }]}>
                <FlatList
                  data={allUsers}
                  renderItem={({ item, index }) =>
                    this.renderallUsersview(item, index)
                  }
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  listKey={(item, index) => "D" + index.toString()}
                  keyExtractor={(item, index) => "D" + index.toString()}
                />
              </View>
            </>
          )}
        </View>
        {this.props.isBusySearchUsers ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusySearchUsers: state.chat.isBusySearchUsers,
    responseSearchUsers: state.chat.responseSearchUsers,
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
        doPostSearchUsers,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserScreen);
