import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { TouchableOpacity, ScrollView, View } from "react-native";
import { Text } from "native-base";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import Header from "../../../components/Header/Header";
import images from "../../../resources/images";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import { EventRegister } from "react-native-event-listeners";
import Colors from "../../../constants/Colors";
import BarcodeScreen from "./BarcodeScreen";
import { getBarcodeSubKind } from "../../../constants/Barcode_helper";
import CustomSlots from "../../../components/buttons/CustomSlots";
import { RFPercentage } from "react-native-responsive-fontsize";
import { HStack, VStack, Box, Button } from "native-base";
import HeadingWithText from "../../../components/RenderFlatlistComponent/HeadingWithText";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../utils/metrics";

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
      availibility: currentUser.availability_string ? currentUser.availability_string : "",
      aboutyou: currentUser.about_us ? currentUser.about_us : "",
      travelDistance: currentUser.distance ? currentUser.distance : "",
      genderPreference: currentUser.gender_preference ? currentUser.gender_preference : "",
      matchStructure: currentUser.match_structure_string ? currentUser.match_structure_string : "",
      age_preference: currentUser.age_preference_string ? currentUser.age_preference_string : "",
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
      name,
      percentage,
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
                    source={profile_url === "" ? images.dummy_user_img : { uri: profile_url }}
                  ></FastImage>
                </View>

                <CustomSlots
                  titleText={percentage + " " + "COMPLETE"}
                  customstyle={{ marginTop: wp(-4), width: "auto", paddingHorizontal: wp(1.75) }}
                />
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
            <Text numberOfLines={1} fontFamily="body" fontStyle="italic" fontWeight="light" fontSize={`${ms(16)}px`}>
              {`${"Jayson Johnson"}, ${age}`}
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
                  5
                </Text>
                <Text color="gray.500" fontSize={`${ms(14)}px`}>
                  Sports
                </Text>
              </VStack>
              <VStack alignItems="center">
                <Text color="primary" fontSize={`${ms(16)}px`}>
                  100
                </Text>
                <Text color="gray.500" fontSize={`${ms(14)}px`}>
                  Players
                </Text>
              </VStack>
              <VStack alignItems="center">
                <Text color="primary" fontSize={`${ms(16)}px`}>
                  50
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
                borderBottomWidth={true ? 2 : 0}
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
                borderBottomWidth={false ? 2 : 0}
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

            <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hp(1.5)}px`} height={`${hs(25)}px`}>
              <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
                About Me
              </Text>
              <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
            </HStack>

            <Text pl={`${wp(5)}px`} fontSize={`${ms(10)}px`} color="black">
              {aboutyou}
            </Text>

            <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hp(1.5)}px`} height={`${hs(25)}px`}>
              <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} color="black">
                My Sports
              </Text>
              <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
            </HStack>

            <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hp(1.5)}px`} height={`${hs(25)}px`}>
              <Text pr={`${wp(3)}px`} lineHeight={`${ms(18)}px`} color="black">
                My Preference
              </Text>
              <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
            </HStack>
          </VStack>
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
