import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Platform, TouchableOpacity, ScrollView, LogBox } from "react-native";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import Header from "../../../components/Header/Header";
import strings from "../../../resources/languages/strings";
import images from "../../../resources/images";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { showSuccessMessage, showErrorMessage } from "../../../utils/helpers";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { doSentFriendRequest } from "../../../redux/actions/AppActions";
import FastImage from "react-native-fast-image";
import Colors from "../../../constants/Colors";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../resources/constants";
import errors from "../../../resources/languages/errors";
import Loader from "../../../components/loaders/Loader";
import * as globals from "../../../utils/Globals";
import CustomOnebuttonComponent from "../../../components/buttons/CustomOnebuttonComponent";
import { EventRegister } from "react-native-event-listeners";
import { doBlockUser } from "../../../redux/actions/ChatActions";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  CloseIcon,
  Divider,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  View,
} from "native-base";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../utils/metrics";
import moment from "moment";

const colorCodes = {
  B: "black",
  P: "green.600",
  I: "#FFB800",
  A: "red.600",
};

class PlayerDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      other_user_info: props.route.params.other_user_info,
      notificationData: props.notificationData,
      username: "",
      age: "",
      name: "",
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
      assign_sport: [],
      sportsDataBeginner: [],
      sportsDataPro: [],
      sportsDataAdvance: [],
      sportsDataIntermediate: [],
      match_structure_string: "",
      matches: [],
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseBlockUser !== this.props.responseBlockUser) {
      if (this.props.responseBlockUser !== undefined) {
        const { success, message, status_code } = this.props.responseBlockUser;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          EventRegister.emit("refreshPlayersList");
          this.props.navigation.goBack();
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

    if (prevProps.responseSentFriendRequestdata !== this.props.responseSentFriendRequestdata) {
      if (this.props.responseSentFriendRequestdata !== undefined) {
        const { success, message, status_code } = this.props.responseSentFriendRequestdata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          EventRegister.emit("refreshPlayersList");
          this.props.navigation.goBack();
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
    await this.setOtheruserInfo();
    LogBox.ignoreAllLogs();
  }

  setOtheruserInfo = () => {
    const { other_user_info } = this.state;
    let sportsDataBeginner = [];
    let sportsDataPro = [];
    let sportsDataAdvance = [];
    let sportsDataIntermediate = [];
    if (other_user_info.assign_sport) {
      sportsDataBeginner = other_user_info.assign_sport.filter((data) => data.status == "B");
      sportsDataPro = other_user_info.assign_sport.filter((data) => data.status == "P");
      sportsDataAdvance = other_user_info.assign_sport.filter((data) => data.status == "A");
      sportsDataIntermediate = other_user_info.assign_sport.filter((data) => data.status == "I");

      sportsDataAdvance = sportsDataAdvance.map((data, index, other_user_info) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != other_user_info.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataIntermediate = sportsDataIntermediate.map((data, index, other_user_info) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != other_user_info.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataPro = sportsDataPro.map((data, index, other_user_info) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != other_user_info.length - 1 ? ", " : ""}
          </Text>
        );
      });

      sportsDataBeginner = sportsDataBeginner.map((data, index, other_user_info) => {
        return (
          <Text key={index} style={[TabStyle.smalltextview]}>
            {data.title}
            {index != other_user_info.length - 1 ? ", " : ""}
          </Text>
        );
      });
    }
    this.setState({
      username: other_user_info.username ? other_user_info.username : "",
      age: other_user_info.age ? other_user_info.age : "",
      gender: other_user_info.gender ? other_user_info.gender : "",
      profile_url: other_user_info.profile_url,
      assign_sport: other_user_info.assign_sport,
      sportsDataBeginner: other_user_info.assign_sport ? sportsDataBeginner : [],
      sportsDataPro: other_user_info.assign_sport ? sportsDataPro : [],
      sportsDataAdvance: other_user_info.assign_sport ? sportsDataAdvance : [],
      sportsDataIntermediate: other_user_info.assign_sport ? sportsDataIntermediate : [],
      location: other_user_info.location,
      availibility: other_user_info.availability_string,
      aboutyou: other_user_info.about_us,
      travelDistance: other_user_info.distance,
      genderPreference: other_user_info.gender_preference,
      matchStructure: other_user_info.match_structure,
      age_preference: other_user_info.age_preference,
      is_request: other_user_info.is_request,
      match_structure_string: other_user_info.match_structure_string,
      matches: other_user_info.matches,
    });
  };

  clickdoSendRequest = async () => {
    const { other_user_info } = this.state;

    if (globals.isInternetConnected == true) {
      let param = {
        receiver_id: other_user_info.id,
      };
      this.props.doSentFriendRequest(param);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoUnBlockUserAPi = async () => {
    const { other_user_info } = this.state;

    if (globals.isInternetConnected == true) {
      let params = {
        to_id: other_user_info.id,
        status: "unblock",
      };
      this.props.doBlockUser(params);
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
      assign_sport,
      location,
      availibility,
      other_user_info,
      is_request,
      matches_count,
      matches,
      approved_requests_count,
      match_structure_string,
      name,
    } = this.state;

    return (
      <View style={[TabCommonStyle.container, { padding: 0 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[ProfileStyle.container]}>
            <View style={ProfileStyle.middle_view}>
              <FastImage
                resizeMethod="resize"
                style={{ width: wp(100), height: wp(100) }}
                source={profile_url === "" ? images.dummy_user_img : { uri: profile_url }}
              ></FastImage>
            </View>
            <View style={[{ marginLeft: wp(5) }]} mt={2}>
              <HStack alignItems="center">
                <Text fontSize={`${ms(25)}px`} fontWeight="bold">
                  {username ? username : ""}
                </Text>

                <Text fontSize={`${ms(20)}px`} ml={1}>
                  {age ? age : ""}
                </Text>
              </HStack>

              <HStack alignItems="center">
                <Text fontSize={`${ms(17)}px`}>{name ? name : ""}</Text>
                {gender ? <Text fontSize={`${ms(17)}px`}>{gender ? gender : ""}</Text> : null}
              </HStack>

              {location ? (
                <View style={{ flexDirection: "row", alignItems: "center" }} mt={2}>
                  <FastImage
                    resizeMode="contain"
                    style={[ProfileStyle.locationicon, { marginRight: 0, marginTop: 1 }]}
                    source={images.home1_img}
                  ></FastImage>

                  <Text fontSize={`${ms(14)}px`} ml={2}>
                    {location ? location : ""}
                  </Text>
                </View>
              ) : null}

              {travelDistance ? (
                <View style={{ flexDirection: "row", alignItems: "center" }} mt={2}>
                  <FastImage
                    resizeMode="contain"
                    style={[ProfileStyle.locationicon, { marginRight: 0, marginTop: 1 }]}
                    source={images.location_img}
                  ></FastImage>

                  <Text fontSize={`${ms(14)}px`} ml={2}>
                    {travelDistance ? `${travelDistance} miles away` : ""}
                  </Text>
                </View>
              ) : null}

              {match_structure_string ? (
                <View style={{ flexDirection: "row", alignItems: "center" }} mt={2}>
                  <FastImage
                    resizeMode="contain"
                    style={[ProfileStyle.locationicon, { marginRight: 0, marginTop: 1 }]}
                    source={images.tennis_racket_img}
                  ></FastImage>

                  <Text fontSize={`${ms(14)}px`} ml={2}>
                    {match_structure_string ? `${match_structure_string}` : ""}
                  </Text>
                </View>
              ) : null}
            </View>

            <Divider mt={4} />

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
                  {approved_requests_count || 0}
                </Text>
                <Text color="gray.500" fontSize={`${ms(14)}px`}>
                  Players
                </Text>
              </VStack>
              <VStack alignItems="center">
                <Text color="primary" fontSize={`${ms(16)}px`}>
                  {matches_count ? matches_count : 0}
                </Text>
                <Text color="gray.500" fontSize={`${ms(14)}px`}>
                  Matches
                </Text>
              </VStack>
            </HStack>

            <Divider my={2} />

            <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hs(1.5)}px`} height={`${hs(25)}px`}>
              <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
                About Me
              </Text>
              <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
            </HStack>

            <Text pl={`${wp(5)}px`} fontSize={`${ms(10)}px`} color="black" mb={`${vs(30)}px`}>
              {aboutyou || ""}
            </Text>

            <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${vs(45)}px`} height={`${hs(25)}px`}>
              <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
                My Sports
              </Text>
              <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
            </HStack>

            <HStack mx={`${wp(5)}px`} mt={`${hs(25)}px`} flexWrap="wrap">
              {(assign_sport || []).map(({ title, status }) => (
                <Box width="1/3" key={title}>
                  <Center
                    borderColor={colorCodes[status]}
                    borderWidth={1}
                    flexDirection="row"
                    borderRadius="full"
                    width={`${hs(100)}px`}
                    height={`${vs(35)}px`}
                    alignItems="center"
                    mb={`${hs(20)}px`}
                    px={1}
                  >
                    <Image alt="sport icon" height={`${hs(15)}px`} width={`${hs(15)}px`} source={images.tennis_img} />
                    <Text
                      fontStyle="italic"
                      fontWeight="light"
                      fontSize={`${ms(12)}px`}
                      lineHeight={`${ms(14)}px`}
                      color={colorCodes[status]}
                      ml={`${hs(6)}px`}
                      flexWrap="wrap"
                      textBreakStrategy="balanced"
                      flexShrink={1}
                      textAlign="center"
                    >
                      {title || ""}
                    </Text>
                  </Center>
                </Box>
              ))}
            </HStack>

            <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${vs(45)}px`} height={`${hs(25)}px`}>
              <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
                My Match Preference
              </Text>
              <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
            </HStack>

            <HStack mx={`${wp(5)}px`} mt={`${hs(25)}px`} flexWrap="wrap">
              {!!genderPreference && (
                <Box width="1/3">
                  <Center
                    bgColor="primary"
                    borderRadius="full"
                    width={`${hs(100)}px`}
                    height={`${vs(35)}px`}
                    alignItems="center"
                    mb={`${hs(20)}px`}
                  >
                    <Text
                      textAlign="center"
                      color="white"
                      fontStyle="italic"
                      fontWeight="light"
                      fontSize={`${ms(12)}px`}
                    >
                      {genderPreference || ""}
                    </Text>
                  </Center>
                </Box>
              )}
              {((age_preference && JSON.parse(age_preference)) || []).map(({ name, id }) => (
                <Box width="1/3" key={id}>
                  <Center
                    bgColor="primary"
                    borderRadius="full"
                    width={`${hs(100)}px`}
                    height={`${vs(35)}px`}
                    alignItems="center"
                    mb={`${hs(20)}px`}
                  >
                    <Text
                      textAlign="center"
                      color="white"
                      fontStyle="italic"
                      fontWeight="light"
                      fontSize={`${ms(12)}px`}
                    >
                      {name || ""}
                    </Text>
                  </Center>
                </Box>
              ))}
              {((matchStructure && JSON.parse(matchStructure)) || []).map(({ name, id }) => (
                <Box width="1/3" key={id}>
                  <Center
                    bgColor="primary"
                    borderRadius="full"
                    width={`${hs(100)}px`}
                    height={`${vs(35)}px`}
                    alignItems="center"
                    mb={`${hs(20)}px`}
                  >
                    <Text
                      textAlign="center"
                      color="white"
                      fontStyle="italic"
                      fontWeight="light"
                      fontSize={`${ms(12)}px`}
                    >
                      {name || ""}
                    </Text>
                  </Center>
                </Box>
              ))}
            </HStack>

            {!!matches && !!matches.length && (
              <>
                <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${vs(45)}px`} height={`${hs(25)}px`}>
                  <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
                    My Completed Matches
                  </Text>
                  <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
                </HStack>

                <HStack justifyContent="center">
                  {matches.map((item) => (
                    <Box
                      borderWidth={1}
                      width={`${hs(140)}`}
                      rounded="lg"
                      borderColor="#FFB800"
                      m={3}
                      bgColor="white"
                      shadow={5}
                      style={{
                        shadowColor: "blue",
                        elevation: 2,
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                      }}
                    >
                      <HStack width="full" justifyContent="flex-end" pr={`${hs(6)}px`}>
                        <Text fontSize={`${hs(7)}px`}>{item.is_status === "Organizer" ? "Organizer" : "Player"}</Text>
                      </HStack>

                      <HStack width="full" rounded="full" mb={`${hs(12)}px`}>
                        <VStack alignItems="center" width={`${hs(45)}px`}>
                          <Text fontSize={`${ms(9)}px`}>{item.match_month ? item.match_month : ""}</Text>
                          <Text fontSize={`${ms(12)}px`}>{item.match_date ? item.match_date : ""}</Text>
                          <Text fontSize={`${ms(7)}px`}>{item.match_day ? item.match_day : ""}</Text>
                          <Text fontSize={`${ms(6)}px`}>
                            {item.match_start_at ? moment(item.match_start_at).format("h:mmA") : ""}
                          </Text>
                        </VStack>

                        <Box height="full" borderColor="blue.600" borderWidth={1}></Box>

                        <VStack flexGrow={1} mx={`${hs(6)}px`}>
                          <HStack>
                            <Text fontSize={`${ms(10)}px`} color="#FFB800">
                              {item.sport ? item.sport : ""}
                            </Text>
                          </HStack>
                          <HStack>
                            <FastImage
                              resizeMode="contain"
                              tintColor={Colors.GREY}
                              source={images.fill_location_img}
                              style={{ width: hs(8), height: hs(8) }}
                            ></FastImage>
                            <Text fontSize={`${ms(7)}px`} numberOfLines={1}>
                              {item.location ? item.location : ""}
                            </Text>
                          </HStack>

                          <HStack alignItems="center" flexGrow={1} my={`${hs(5)}px`} space={1}>
                            {item.confirmed_player.slice(3).map(({ profile_url }) => (
                              <Image
                                source={profile_url ? { uri: profile_url } : images.dummy_user_img}
                                borderWidth={1}
                                width={`${hs(25)}px`}
                                height={`${hs(25)}px`}
                                resizeMode="contain"
                                resizeMethod="resize"
                                rounded="full"
                              />
                            ))}
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </HStack>
              </>
            )}

            <HStack justifyContent="center" space={4} border={1} my={6}>
              <IconButton
                rounded="full"
                bgColor="white"
                width={`${hs(60)}px`}
                height={`${hs(60)}px`}
                _icon={{ color: "primary" }}
                icon={<CloseIcon />}
                shadow="2"
                onPress={() => this.props.navigation.goBack()}
              ></IconButton>
              <IconButton
                rounded="full"
                width={`${hs(60)}px`}
                height={`${hs(60)}px`}
                bgColor="primary"
                _icon={{ color: "white", size: "4xl" }}
                icon={<CheckIcon />}
                shadow="2"
                onPress={() => (is_request == "block" ? this.gotoUnBlockUserAPi() : this.clickdoSendRequest())}
              ></IconButton>
            </HStack>
          </View>
        </ScrollView>

        {this.props.isBusySentFriendRequest || this.props.isBusyBlockUser ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusySentFriendRequest: state.app.isBusySentFriendRequest,
    responseSentFriendRequestdata: state.app.responseSentFriendRequestdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
    isBusyBlockUser: state.chat.isBusyBlockUser,
    responseBlockUser: state.chat.responseBlockUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doSentFriendRequest,
        doBlockUser,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetailScreen);
