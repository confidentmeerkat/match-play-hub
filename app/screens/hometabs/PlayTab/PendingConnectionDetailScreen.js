import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, Alert, Platform, ScrollView, View } from "react-native";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import Header from "../../../components/Header/Header";
import strings from "../../../resources/languages/strings";
import images from "../../../resources/images";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { showSuccessMessage, showErrorMessage } from "../../../utils/helpers";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { doAcceptFriendRequest } from "../../../redux/actions/AppActions";
import FastImage from "react-native-fast-image";
import Colors from "../../../constants/Colors";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import CustomTwoSegmentCoponent from "../../../components/buttons/CustomTwoSegmentCoponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../resources/constants";
import errors from "../../../resources/languages/errors";
import Loader from "../../../components/loaders/Loader";
import * as globals from "../../../utils/Globals";
import { EventRegister } from "react-native-event-listeners";

class PendingConnectionDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      other_user_info: props.route.params.other_user_info,
      username: "",
      age: "",
      gender: "",
      location: "",
      availibility: "",
      aboutyou: "",
      travelDistance: "",
      genderPreference: "",
      matchStructure: "",
      profile_url: "",
      age_preference: "",
      assign_sport: [],
      sportsDataBeginner: [],
      sportsDataPro: [],
      sportsDataAdvance: [],
      sportsDataIntermediate: [],
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.responseAcceptFriendRequestdata !==
      this.props.responseAcceptFriendRequestdata
    ) {
      if (this.props.responseAcceptFriendRequestdata !== undefined) {
        const { success, message, status_code } =
          this.props.responseAcceptFriendRequestdata;

        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.props.navigation.goBack();
          EventRegister.emit("refreshPendingConnection");
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
    await this.setOtheruserInfo();
  }

  componentWillUnmount() {}

  setOtheruserInfo = () => {
    const { other_user_info } = this.state;
    let sportsDataBeginner = [];
    let sportsDataPro = [];
    let sportsDataAdvance = [];
    let sportsDataIntermediate = [];
    if (other_user_info.assign_sport) {
      sportsDataBeginner = other_user_info.assign_sport.filter(
        (data) => data.status == "B"
      );
      sportsDataPro = other_user_info.assign_sport.filter(
        (data) => data.status == "P"
      );
      sportsDataAdvance = other_user_info.assign_sport.filter(
        (data) => data.status == "A"
      );
      sportsDataIntermediate = other_user_info.assign_sport.filter(
        (data) => data.status == "I"
      );

      sportsDataAdvance = sportsDataAdvance.map(
        (data, index, other_user_info) => {
          return (
            <Text key={index} style={[TabStyle.smalltextview]}>
              {data.title}
              {index != other_user_info.length - 1 ? ", " : ""}
            </Text>
          );
        }
      );

      sportsDataIntermediate = sportsDataIntermediate.map(
        (data, index, other_user_info) => {
          return (
            <Text key={index} style={[TabStyle.smalltextview]}>
              {data.title}
              {index != other_user_info.length - 1 ? ", " : ""}
            </Text>
          );
        }
      );

      sportsDataPro = sportsDataPro.map((data, index, other_user_info) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != other_user_info.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataBeginner = sportsDataBeginner.map(
        (data, index, other_user_info) => {
          return (
            <Text key={index} style={[TabStyle.smalltextview]}>
              {data.title}
              {index != other_user_info.length - 1 ? ", " : ""}
            </Text>
          );
        }
      );
    }
    this.setState({
      username: other_user_info.username ? other_user_info.username : "",
      age: other_user_info.age ? other_user_info.age : "",
      gender: other_user_info.gender ? other_user_info.gender : "",
      profile_url: other_user_info.profile_url,
      assign_sport: other_user_info.assign_sport,
      sportsDataBeginner: other_user_info.assign_sport
        ? sportsDataBeginner
        : [],
      sportsDataPro: other_user_info.assign_sport ? sportsDataPro : [],
      sportsDataAdvance: other_user_info.assign_sport ? sportsDataAdvance : [],
      sportsDataIntermediate: other_user_info.assign_sport
        ? sportsDataIntermediate
        : [],
      location: other_user_info.location,
      availibility: other_user_info.availability_string,
      aboutyou: other_user_info.about_us,
      travelDistance: other_user_info.distance,
      genderPreference: other_user_info.gender_preference,
      matchStructure: other_user_info.match_structure,
      age_preference: other_user_info.age_preference_string,
    });
  };

  gotoApproveRequest = async (status) => {
    if (status == "deny") {
      Alert.alert(
        strings.dialog_title_confirm_deny,
        strings.dialog_message_confirm_deny,
        [
          {
            text: strings.btn_cancel,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: strings.btn_deny,
            onPress: () => {
              this.acceptordenyReuest(status);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      this.acceptordenyReuest(status);
    }
  };

  acceptordenyReuest = async (status) => {
    const { other_user_info } = this.state;

    if (globals.isInternetConnected == true) {
      let param = {
        sender_id: other_user_info.id,
        status: status,
      };
      this.props.doAcceptFriendRequest(param);
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

  render() {
    const {
      username,
      age,
      gender,
      matchStructure,
      genderPreference,
      age_preference,
      aboutyou,
      travelDistance,
      profile_url,
      location,
      assign_sport,
      availibility,
      sportsDataIntermediate,
      sportsDataAdvance,
      sportsDataPro,
      sportsDataBeginner,
    } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={[ProfileStyle.container, { marginHorizontal: wp(5) }]}>
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          >
            <View style={ProfileStyle.middle_view}>
              <FastImage
                resizeMethod="resize"
                style={ProfileStyle.imageStyle}
                source={
                  profile_url === ""
                    ? images.dummy_user_img
                    : { uri: profile_url }
                }
              ></FastImage>
            </View>
            <View
              showsVerticalScrollIndicator={false}
              style={[{ marginLeft: wp(5) }]}
            >
              <Text numberOfLines={1} style={ProfileStyle.headertext}>
                {username ? username : ""}
              </Text>
              {gender ? (
                <Text numberOfLines={1} style={ProfileStyle.smalltextview}>
                  {gender ? gender + " " : ""} {age ? age : ""}{" "}
                </Text>
              ) : null}
              {location ? (
                <View style={{ flexDirection: "row" }}>
                  <FastImage
                    resizeMode="contain"
                    tintColor={Colors.GREY}
                    style={[
                      ProfileStyle.locationicon,
                      { marginRight: 0, marginTop: 1 },
                    ]}
                    source={images.fill_location_img}
                  ></FastImage>

                  <Text numberOfLines={1} style={ProfileStyle.smalltextview}>
                    {location ? location : ""}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <CustomTwoSegmentCoponent
            segmentOneTitle={strings.acceptRequest}
            segmentOneImage={images.round_right_img}
            isSelectedTab={"true"}
            segmentTwoTitle={strings.denyRequest}
            segmentTwoImage={images.close_img}
            onPressSegmentOne={() => this.gotoApproveRequest("accept")}
            onPressSegmentTwo={() => this.gotoApproveRequest("deny")}
          />

          <ScrollView
            style={{
              // marginTop: -hp(3),
              marginBottom: hp(4),
              marginHorizontal: wp(0.5),
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                ProfileStyle.subview,
                { marginTop: hp(3), marginBottom: hp(2.5) },
              ]}
            >
              <Text style={ProfileStyle.headertext}>{"Sports"}</Text>
              {sportsDataPro.length > 0 ? (
                <>
                  <Text
                    style={[
                      ProfileStyle.headertext,
                      { fontSize: 16, marginTop: hp(1) },
                    ]}
                  >
                    {"Pro"}
                  </Text>
                  <Text>{sportsDataPro}</Text>
                </>
              ) : null}
              {sportsDataAdvance.length > 0 ? (
                <>
                  <Text
                    style={[
                      ProfileStyle.headertext,
                      { fontSize: 16, marginTop: hp(1) },
                    ]}
                  >
                    {"Advanced"}
                  </Text>
                  <Text>{sportsDataAdvance}</Text>
                </>
              ) : null}
              {sportsDataIntermediate.length > 0 ? (
                <>
                  <Text
                    style={[
                      ProfileStyle.headertext,
                      { fontSize: 16, marginTop: hp(1) },
                    ]}
                  >
                    {"Intermediate"}
                  </Text>
                  <Text>{sportsDataIntermediate}</Text>
                </>
              ) : null}
              {sportsDataBeginner.length > 0 ? (
                <>
                  <Text
                    style={[
                      ProfileStyle.headertext,
                      { fontSize: 16, marginTop: hp(1) },
                    ]}
                  >
                    {"Beginner"}
                  </Text>
                  <Text>{sportsDataBeginner}</Text>
                </>
              ) : null}
            </View>
            <View style={ProfileStyle.subview}>
              <Text style={ProfileStyle.headertext}>{"Availability"}</Text>
              <Text style={ProfileStyle.subtitleview}>
                {availibility ? availibility : ""}
              </Text>
            </View>
            <View style={ProfileStyle.subview}>
              <Text style={ProfileStyle.headertext}>{"About Me"}</Text>
              <Text numberOfLines={4} style={ProfileStyle.subtitleview}>
                {aboutyou ? aboutyou : ""}
              </Text>
            </View>

            <View style={ProfileStyle.subview}>
              <Text style={ProfileStyle.headertext}>{"Travel Distance"}</Text>
              <Text style={ProfileStyle.subtitleview}>
                {travelDistance ? travelDistance + "mi" : ""}
              </Text>
            </View>
            <View style={ProfileStyle.subview}>
              <Text style={ProfileStyle.headertext}>{"Gender Preference"}</Text>
              <Text style={ProfileStyle.subtitleview}>{genderPreference}</Text>
            </View>
            <View style={ProfileStyle.subview}>
              <Text style={ProfileStyle.headertext}>{"Age Preference"}</Text>
              <Text style={ProfileStyle.subtitleview}>{age_preference}</Text>
            </View>
            <View style={ProfileStyle.subview}>
              <Text style={ProfileStyle.headertext}>{"Match Preference"}</Text>
              <Text style={ProfileStyle.subtitleview}>{matchStructure}</Text>
            </View>
          </ScrollView>
        </View>
        {this.props.isBusyAcceptFriendRequest ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyAcceptFriendRequest: state.app.isBusyAcceptFriendRequest,
    responseAcceptFriendRequestdata: state.app.responseAcceptFriendRequestdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doAcceptFriendRequest,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingConnectionDetailScreen);
