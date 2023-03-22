import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { TouchableOpacity, ScrollView, View } from "react-native";
import { Center, Image, Text } from "native-base";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import Header from "../../../components/Header/Header";
import images from "../../../resources/images";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import { EventRegister } from "react-native-event-listeners";
import BarcodeScreen from "./BarcodeScreen";
import { getBarcodeSubKind } from "../../../constants/Barcode_helper";
import CustomSlots from "../../../components/buttons/CustomSlots";
import { HStack, VStack, Box, Button } from "native-base";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../utils/metrics";
import { bindActionCreators } from "redux";
import { doGetUserUpcomingMatch, doRefreshToken } from "../../../redux/actions/AppActions";
import Swiper from "react-native-web-swiper";
import AboutMe from "./About";
import HubTab from "./HubTab";

const colorCodes = {
  B: "black",
  P: "green.600",
  I: "#FFB800",
  A: "red.600",
};

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
      matchStructure: [],
      profile_url: "",
      age_preference: [],
      is_request: "",
      barcodeData: "",
      assign_sport: [],
      qr_url: "",
      percentage: "",
      upcomingMatchesList: [],
      playerMatches: [],
      newMessages: [],
      index: 0,
    };
  }

  async componentDidMount() {
    if (this.props.currentUser !== undefined) {
      await this.setCurrentUser();
      this.getUpcomingMatchList();
      this._unsubscribe = this.props.navigation.addListener("focus", async () => {
        await this.getUpcomingMatchList();
      });
    }
    this.listener = EventRegister.addEventListener("initializeApp", () => {
      this.setCurrentUser();
    });
  }

  setuserUpcomingMatchList(finalMatchData, message_request, player_request) {
    this.setState({
      upcomingMatchesList: finalMatchData,
      playerMatches: player_request,
      newMessages: message_request,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.responseGetUserUpcomingMatchdata !== this.props.responseGetUserUpcomingMatchdata) {
      if (this.props.responseGetUserUpcomingMatchdata !== undefined) {
        const { success, message, finalMatchData, message_request, player_request, status_code } =
          this.props.responseGetUserUpcomingMatchdata;
        if (status_code == 200 && success == true) {
          this.setuserUpcomingMatchList(finalMatchData, message_request, player_request);
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

  getUpcomingMatchList = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doGetUserUpcomingMatch();
    } else {
      // showErrorMessage(errors.no_internet);
    }
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
      availibility: currentUser.availability_string ? currentUser.availability_string : "",
      aboutyou: currentUser.about_us ? currentUser.about_us : "",
      travelDistance: currentUser.distance ? currentUser.distance : "",
      genderPreference: currentUser.gender_preference ? currentUser.gender_preference : "",
      matchStructure: currentUser.match_structure ? JSON.parse(currentUser.match_structure) || [] : [],
      age_preference: currentUser.age_preference ? JSON.parse(currentUser.age_preference) || [] : [],
      is_request: currentUser.is_request ? currentUser.is_request : "",
      qr_url: currentUser.qr_url ? currentUser.qr_url : "",
      percentage: currentUser.percentage ? currentUser.percentage : "",
      name: currentUser.name ? currentUser.name : "",
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
    this.props.navigation.navigate("EditProfile", { isFrom: "" });
  };

  updateIndex = (index) => {
    this.setState({ index });
  };

  render() {
    const {
      username,
      age,
      profile_url,
      assign_sport,
      location,
      availibility,
      currentUser,
      is_request,
      name,
      percentage,
      upcomingMatchesList,
      newMessages,
      playerMatches,
      index,
    } = this.state;

    let sportsDataBeginner = [];
    let sportsDataPro = [];
    let sportsDataAdvance = [];
    let sportsDataIntermediate = [];
    if (currentUser.assign_sport) {
      sportsDataBeginner = currentUser.assign_sport.filter((data) => data.status == "B");
      sportsDataPro = currentUser.assign_sport.filter((data) => data.status == "P");
      sportsDataAdvance = currentUser.assign_sport.filter((data) => data.status == "A");
      sportsDataIntermediate = currentUser.assign_sport.filter((data) => data.status == "I");

      sportsDataAdvance = sportsDataAdvance.map((data, index, currentUser) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != currentUser.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataIntermediate = sportsDataIntermediate.map((data, index, currentUser) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != currentUser.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataPro = sportsDataPro.map((data, index, currentUser) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != currentUser.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataBeginner = sportsDataBeginner.map((data, index, currentUser) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != currentUser.length - 1 ? ", " : ""}
          </Text>
        );
      });
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
              <TouchableOpacity
                onPress={() => this.doClickEditProfile()}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={ProfileStyle.middle_view}>
                  <FastImage
                    resizeMethod="resize"
                    style={ProfileStyle.imageStyle}
                    alt="profile image"
                    source={profile_url === "" ? images.dummy_user_img : { uri: profile_url }}
                  ></FastImage>
                </View>

                <CustomSlots
                  titleText={percentage + " " + "COMPLETE"}
                  customstyle={{ marginTop: wp(-4), width: "auto", paddingHorizontal: wp(1.75) }}
                />
              </TouchableOpacity>

              <View style={ProfileStyle.last_endview}>
                <TouchableOpacity onPress={() => this.gotoSetting()}>
                  <FastImage
                    style={[ProfileStyle.settingsiconstyle]}
                    source={images.settings_img}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[ProfileStyle.middlecontainer, { marginBottom: hp(1) }]}>
            <Text numberOfLines={1} fontFamily="body" fontStyle="italic" fontWeight="light" fontSize={`${ms(16)}px`}>
              {`${name || username}, ${age}`}
            </Text>

            {location ? (
              <View style={{ flexDirection: "row" }}>
                <Text
                  numberOfLines={1}
                  fontFamily="body"
                  fontStyle="italic"
                  fontWeight="light"
                  fontSize={`${ms(14)}px`}
                  color="gray.500"
                >
                  {location}
                </Text>
              </View>
            ) : null}
          </View>

          <VStack flex={1}>
            <HStack justifyContent="center" space={wp(16)} mt={hp(1)}>
              <VStack alignItems="center">
                <Text color="primary" fontSize={`${ms(16)}px`}>
                  {assign_sport.length || 0}
                </Text>
                <Text color="gray.500" fontSize={`${ms(14)}px`}>
                  Sports
                </Text>
              </VStack>
              <VStack alignItems="center">
                <Text color="primary" fontSize={`${ms(16)}px`}>
                  {playerMatches.length || 0}
                </Text>
                <Text color="gray.500" fontSize={`${ms(14)}px`}>
                  Players
                </Text>
              </VStack>
              <VStack alignItems="center">
                <Text color="primary" fontSize={`${ms(16)}px`}>
                  {upcomingMatchesList.length || 0}
                </Text>
                <Text color="gray.500" fontSize={`${ms(14)}px`}>
                  Matches
                </Text>
              </VStack>
            </HStack>

            <HStack
              mx={wp(5)}
              borderBottomColor="gray.200"
              borderBottomWidth={1}
              mt={hp(2)}
              justifyContent="center"
              space={`${hs(40)}px`}
              p={0}
            >
              <Button
                variant="unstyled"
                py={0}
                borderBottomColor="primary"
                borderBottomWidth={index === 0 ? 2 : 0}
                _text={{
                  color: "gray.400",
                  fontSize: `${ms(16)}px`,
                  lineHeight: `${ms(24)}px`,
                  fontStyle: "italic",
                  fontWeight: "light",
                  fontFamily: "body",
                }}
              >
                About
              </Button>
              <Button
                variant="unstyled"
                py={0}
                borderBottomColor="primary"
                borderBottomWidth={index % 2 === 1 ? 2 : 0}
                _text={{
                  color: "gray.400",
                  fontSize: `${ms(16)}px`,
                  lineHeight: `${ms(24)}px`,
                  fontStyle: "italic",
                  fontWeight: "light",
                  fontFamily: "body",
                }}
              >
                HUB
              </Button>
            </HStack>

            <ScrollView contentContainerStyle={{ flex: 1 }}>
              <Swiper loop={true} onIndexChanged={this.updateIndex} controlsEnabled={false}>
                <AboutMe />
                <HubTab />
              </Swiper>
            </ScrollView>
          </VStack>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser,
    responseGetUserUpcomingMatchdata: state.app.responseGetUserUpcomingMatchdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ doGetUserUpcomingMatch, doRefreshToken }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen);
