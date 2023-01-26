import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text, TouchableOpacity, ScrollView, View } from "react-native";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import Header from "../../../components/Header/Header";
import images from "../../../resources/images";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import { EventRegister } from "react-native-event-listeners";
import Colors from "../../../constants/Colors";
import BarcodeScreen from "./BarcodeScreen";
import { getBarcodeSubKind } from "../../../constants/Barcode_helper";
import CustomSlots from "../../../components/buttons/CustomSlots";

class MyProfileScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
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
      is_request: "",
      barcodeData: "",
      assign_sport: [],
      qr_url: "",
      percentage: "",
    };
  }

  async componentDidMount() {
    if (this.props.currentUser !== undefined) {
      await this.setCurrentUser();
    }
    this.listener = EventRegister.addEventListener("initializeApp", () => {
      this.setCurrentUser();
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

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

  setUserInfo = () => {
    const { currentUser } = this.state;
    let thisLocation = "";
    if (currentUser.city && currentUser.city != "undefined") {
      thisLocation = thisLocation + currentUser.city;
    }
    if (currentUser.state && currentUser.state != "undefined") {
      if (thisLocation == "") {
        thisLocation = currentUser.state;
      } else {
        thisLocation = thisLocation + ", " + currentUser.state;
      }
    }
    this.setState({
      username: currentUser.username ? currentUser.username : "",
      age: currentUser.age ? currentUser.age : "",
      gender: currentUser.gender ? currentUser.gender : "",
      profile_url: currentUser.profile_url ? currentUser.profile_url : "",
      assign_sport: currentUser.assign_sport ? currentUser.assign_sport : [],
      location: thisLocation,
      availibility: currentUser.availability_string
        ? currentUser.availability_string
        : "",
      aboutyou: currentUser.about_us ? currentUser.about_us : "",
      travelDistance: currentUser.distance ? currentUser.distance : "",
      genderPreference: currentUser.gender_preference
        ? currentUser.gender_preference
        : "",
      matchStructure: currentUser.match_structure_string
        ? currentUser.match_structure_string
        : "",
      age_preference: currentUser.age_preference_string
        ? currentUser.age_preference_string
        : "",
      is_request: currentUser.is_request ? currentUser.is_request : "",
      qr_url: currentUser.qr_url ? currentUser.qr_url : "",
      percentage: currentUser.percentage ? currentUser.percentage : "",
    });
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
  gotoSetting = () => {
    this.props.navigation.navigate("Setting");
  };
  doClickEditProfile = () => {
    this.props.navigation.navigate("EditProfile",{isFrom:''});
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
      assign_sport,
      location,
      availibility,
      currentUser,
      is_request,
      percentage,
    } = this.state;
    let sportsDataBeginner = [];
    let sportsDataPro = [];
    let sportsDataAdvance = [];
    let sportsDataIntermediate = [];
    if (currentUser.assign_sport) {
      sportsDataBeginner = currentUser.assign_sport.filter(
        (data) => data.status == "B"
      );
      sportsDataPro = currentUser.assign_sport.filter(
        (data) => data.status == "P"
      );
      sportsDataAdvance = currentUser.assign_sport.filter(
        (data) => data.status == "A"
      );
      sportsDataIntermediate = currentUser.assign_sport.filter(
        (data) => data.status == "I"
      );

      sportsDataAdvance = sportsDataAdvance.map((data, index, currentUser) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != currentUser.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataIntermediate = sportsDataIntermediate.map(
        (data, index, currentUser) => {
          return (
            <Text key={index} style={[TabStyle.smalltextview]}>
              {data.title}
              {index != currentUser.length - 1 ? ", " : ""}
            </Text>
          );
        }
      );

      sportsDataPro = sportsDataPro.map((data, index, currentUser) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != currentUser.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataBeginner = sportsDataBeginner.map(
        (data, index, currentUser) => {
          return (
            <Text key={index} style={[TabStyle.smalltextview]}>
              {data.title}
              {index != currentUser.length - 1 ? ", " : ""}
            </Text>
          );
        }
      );
    }
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={[ProfileStyle.container, { marginTop: -hp(2) }]}>
          <BarcodeScreen
            ref={(r) => (this._barCodeView = r)}
            subKind={getBarcodeSubKind()}
            getBarcode={(data) => this.getBarcode(data)}
          />
          <View style={[ProfileStyle.innercontainer, { marginTop: 0 }]}>
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
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
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

                <CustomSlots titleText={percentage + " " + "COMPLETE"} />
                <TouchableOpacity onPress={() => this.doClickEditProfile()}>
                  <FastImage
                    style={[ProfileStyle.qrcodestyle]}
                    source={images.edit_profile_img}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              </View>

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
                    style={[
                      ProfileStyle.qrcodestyle,
                      { marginVertical: hp(2) },
                    ]}
                    source={images.edit_profile_img}
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
          <View style={ProfileStyle.lineViewContainer}></View>
          <ScrollView
            style={{
              marginTop: -hp(2),
              marginBottom: hp(4),
              marginHorizontal: wp(5),
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
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { currentUser: state.auth.currentUser };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen);
