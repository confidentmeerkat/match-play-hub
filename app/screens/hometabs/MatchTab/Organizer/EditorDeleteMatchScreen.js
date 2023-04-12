import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { View, Platform, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import strings from "../../../../resources/languages/strings";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import CustomTwoSegmentCoponent from "../../../../components/buttons/CustomTwoSegmentCoponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum, sportLevels } from "../../../../resources/constants";
import errors from "../../../../resources/languages/errors";
import Loader from "../../../../components/loaders/Loader";
import images from "../../../../resources/images";
import { doSentFriendRequest, doDeleteMatch } from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import MatchDetailComponent from "../../../../components/RenderFlatlistComponent/MatchDetailComponent";
import { showErrorMessage, showSuccessMessage } from "../../../../utils/helpers";
import * as globals from "../../../../utils/Globals";
import * as AddCalendarEvent from "react-native-add-calendar-event";
import moment from "moment";
import MediaModel from "../../../../components/modals/MediaModel";
import { ProfileStyle } from "../../../../../assets/styles/ProfileStyle";
import Colors from "../../../../constants/Colors";
import FastImage from "react-native-fast-image";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import CustomOnebuttonComponent from "../../../../components/buttons/CustomOnebuttonComponent";
import { EventRegister } from "react-native-event-listeners";
import {
  Box,
  Button,
  Center,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FlatList,
  HStack,
  IconButton,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../../utils/metrics";
import HeadingWithText from "../../../../components/RenderFlatlistComponent/HeadingWithText";

class EditorDeleteMatchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmedPlayersList: [],
      matchDetail: props.route.params.matchDetail,
      organizer: {},
      isCalandarPicker: false,
      isOrganizer: false,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseDeleteMatchdata !== this.props.responseDeleteMatchdata) {
      if (this.props.responseDeleteMatchdata !== undefined) {
        const { success, message, status_code } = this.props.responseDeleteMatchdata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          EventRegister.emit("RefreshMatchList");
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

    if (prevProps.responseSentFriendRequestdata !== this.props.responseSentFriendRequestdata) {
      if (this.props.responseSentFriendRequestdata !== undefined) {
        const { success, message, status_code } = this.props.responseSentFriendRequestdata;

        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          EventRegister.emit("refreshPlayersList");
          EventRegister.emit("RefreshMatchList");
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
    this.listenerone = EventRegister.addEventListener("UpdateMatchList", async ({ updatedMatchData }) => {
      await this.updateMatchDetails(updatedMatchData);
    });
    await this.updateMatchDetails(this.state.matchDetail);
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listenerone);
  }

  updateMatchDetails = (matchDetail) => {
    this.setState(
      {
        matchDetail: matchDetail,
        organizer: matchDetail.Organizer,
        confirmedPlayersList: matchDetail.confirmed_player,
      },

      () => {
        if (this.props.currentUser.id == matchDetail.Organizer.user_id) {
          this.setState({ isOrganizer: true });
        }
      }
    );
  };

  gotoApproveRequest = async (status) => {
    if (status == "delete") {
      Alert.alert(
        strings.dialog_title_confirm_delete,
        strings.dialog_message_confirm_delete,
        [
          {
            text: strings.btn_cancel,
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: strings.btn_delete,
            onPress: () => {
              this.deleteMatchAPi();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      this.EditMatch();
    }
  };

  gotoManagePlayers = () => {
    this.props.navigation.navigate("MatchDetailInterestedandConfirmPlayers", {
      matchDetail: this.state.matchDetail,
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

  deleteMatchAPi = async () => {
    const { matchDetail } = this.state;

    if (globals.isInternetConnected == true) {
      const params = {
        match_id: matchDetail.id,
      };
      this.props.doDeleteMatch(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  EditMatch = async () => {
    this.props.navigation.navigate("EditMatch", {
      matchDetail: this.state.matchDetail,
      isFrom: "EditMatch",
    });
  };

  gotoMapScreen = () => {
    this.props.navigation.navigate("MapView", {
      matchDetail: this.state.matchDetail,
    });
  };

  gotoonMatchClick = () => {
    this.displayCalandarPicker();
  };

  gotoOrganizerMessage = () => {
    this.props.navigation.navigate("ChatDetail", {
      other_user_info_Id: this.state.organizer.user_id,
      isFrom: "WithoutFilter",
    });
  };

  onPresssendRequest = async () => {
    const { organizer } = this.state;
    if (globals.isInternetConnected == true) {
      let param = {
        receiver_id: organizer.user_id,
      };
      this.props.doSentFriendRequest(param);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  onPressmanageRequest = async () => {
    this.props.navigation.navigate("PLAY", { isfrom: "manageRequest" });
  };

  //display Calandar Picker model
  displayCalandarPicker = () => {
    this.setState({ isCalandarPicker: !this.state.isCalandarPicker });
  };

  utcDateToString = (momentInUTC) => {
    if (Platform.OS == "android") {
      let platformwiseDateFormated = moment(momentInUTC).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      return platformwiseDateFormated;
    } else {
      let platformwiseDateFormated = moment(momentInUTC).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      return platformwiseDateFormated;
    }
  };

  onClickAddtoCalendar = () => {
    const { matchDetail } = this.state;
    const eventConfig = {
      title: matchDetail.sport ? matchDetail.sport : "",
      startDate: matchDetail.formated_start_date ? this.utcDateToString(matchDetail.formated_start_date) : "",
      endDate: matchDetail.formated_end_date ? this.utcDateToString(matchDetail.formated_end_date) : "",
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(({ calendarItemIdentifier, eventIdentifier }) => {
        if (calendarItemIdentifier != undefined && eventIdentifier != undefined) {
        }
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.log("error", error);
        this.displayCalandarPicker();
        showErrorMessage(errors.allowCalendarPermission);
      });
  };

  render() {
    const { confirmedPlayersList, isOrganizer, matchDetail, isCalandarPicker } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <HStack width="full">
          <IconButton _icon={{ color: "black" }} icon={<ChevronLeftIcon />} />
          <HStack flexGrow={1} mx={`${wp(5)}px`} alignItems="center" space="8">
            <Button
              flex={1}
              bgColor={Colors.ORANGE}
              borderRadius={5}
              borderColor={Colors.DARK_GREY}
              _text={{
                color: Colors.WHITE,
                fontSize: `${ms(15)}px`,
                fontStyle: "italic",
              }}
              height={`${vs(28)}px`}
              padding="0"
            >
              Edit Match
            </Button>
            <Button
              flex={1}
              bgColor={Colors.ORANGE}
              borderRadius={5}
              borderColor={Colors.DARK_GREY}
              _text={{
                color: Colors.WHITE,
                fontSize: `${ms(15)}px`,
                fontStyle: "italic",
              }}
              height={`${vs(28)}px`}
              padding="0"
            >
              Delete Match
            </Button>
          </HStack>
        </HStack>

        <Box bgColor="black">
          <ImageBackground source={images.match_bg_img} resizeMode="cover" imageStyle={{ opacity: 0.4 }}>
            <VStack alignItems="center" my={4}>
              <HStack justifyContent="center" alignItems="center" flexGrow={1}>
                <HStack alignContent="center">
                  <Image
                    source={images.calendar1_img}
                    style={{ width: hs(32), height: hs(36) }}
                    resizeMode="contain"
                    mt={1}
                  />
                  <VStack alignItems="center" mx={3}>
                    <Text lineHeight={`${ms(24)}px`} fontWeight="bold" fontSize={`${ms(14)}px`} color="white">
                      {matchDetail.match_month}
                    </Text>
                    <Text lineHeight={`${ms(24)}px`} fontWeight="bold" fontSize={`${ms(14)}px`} color="white">
                      {matchDetail.match_date}
                    </Text>
                  </VStack>
                </HStack>

                <View style={[TabStyle.lineView, { backgroundColor: "white", width: 1 }]} />

                <VStack>
                  <Text color={Colors.YELLOW} fontSize={`${ms(20)}px`} fontWeight="bold" lineHeight={`${ms(28)}px`}>
                    {matchDetail.sport}
                  </Text>
                  <Text color="white" fontSize={`${ms(14)}px`} fontWeight="bold" lineHeight={`${ms(28)}px`}>
                    {matchDetail.match_day
                      ? matchDetail.match_day + ", " + matchDetail.match_time_period
                      : matchDetail.match_time_period}
                  </Text>
                </VStack>
              </HStack>

              <Text color="white" fontSize={`${ms(11)}px`} lineHeight={`${ms(28)}px`}>
                {matchDetail.location}
              </Text>

              <Button
                p={0}
                rightIcon={<ChevronRightIcon />}
                _icon={{ color: "white", size: `${hs(12)}px` }}
                _stack={{ space: 0, alignItems: "center" }}
                _text={{ fontSize: `${ms(12)}px`, fontWeight: "bold" }}
                onPress={() => this.gotoMapScreen()}
              >
                View on Map
              </Button>
            </VStack>
          </ImageBackground>
        </Box>

        <ScrollView>
          <HeadingWithText titleText={"Match Details"} marginVerticalview={hp(2)} marginLeftview={wp(3)} />

          <HStack mx={`${wp(5)}px`} flexWrap="wrap">
            {matchDetail.cost ? (
              <Box width="1/3">
                <Center
                  borderColor="primary"
                  rounded="full"
                  width={`${hs(100)}px`}
                  height={`${vs(28)}px`}
                  alignItems="center"
                  borderWidth={1}
                  mb={`${hs(18)}px`}
                >
                  <Text
                    textAlign="center"
                    color="primary"
                    fontStyle="italic"
                    fontWeight="light"
                    fontSize={`${ms(12)}px`}
                  >
                    {"$$$: " + matchDetail.cost}
                  </Text>
                </Center>
              </Box>
            ) : null}

            <Box width="1/3">
              <Center
                borderColor="primary"
                rounded="full"
                width={`${hs(100)}px`}
                height={`${vs(28)}px`}
                alignItems="center"
                flexDirection="row"
                borderWidth={1}
                mb={`${hs(18)}px`}
              >
                <Image source={images.confirmed_img} />
                <Text
                  textAlign="center"
                  ml={`${hs(6)}px`}
                  fontStyle="italic"
                  fontWeight="light"
                  fontSize={`${ms(12)}px`}
                >
                  {matchDetail.is_status === "Organizer" || matchDetail.is_status === "Confirmed" ? "Yes" : "No"}
                </Text>
              </Center>
            </Box>

            {JSON.parse(matchDetail.gender).map(({ name }) => (
              <Box width="1/3">
                <Center
                  borderColor="primary"
                  rounded="full"
                  width={`${hs(100)}px`}
                  height={`${vs(28)}px`}
                  alignItems="center"
                  flexDirection="row"
                  borderWidth={1}
                  mb={`${hs(18)}px`}
                >
                  <Text
                    textAlign="center"
                    ml={`${hs(6)}px`}
                    fontStyle="italic"
                    fontWeight="light"
                    color="primary"
                    fontSize={`${ms(12)}px`}
                  >
                    {name}
                  </Text>
                </Center>
              </Box>
            ))}

            {JSON.parse(matchDetail.age).map(({ name }) => (
              <Box width="1/3">
                <Center
                  borderColor="primary"
                  rounded="full"
                  width={`${hs(100)}px`}
                  height={`${vs(28)}px`}
                  alignItems="center"
                  flexDirection="row"
                  borderWidth={1}
                  mb={`${hs(18)}px`}
                >
                  <Text
                    textAlign="center"
                    ml={`${hs(6)}px`}
                    fontStyle="italic"
                    fontWeight="light"
                    color="primary"
                    fontSize={`${ms(12)}px`}
                  >
                    {"Age: " + name}
                  </Text>
                </Center>
              </Box>
            ))}

            {matchDetail.level ? (
              <Box width="1/3">
                <Center
                  borderColor="primary"
                  rounded="full"
                  width={`${hs(100)}px`}
                  height={`${vs(28)}px`}
                  alignItems="center"
                  flexDirection="row"
                  borderWidth={1}
                  mb={`${hs(18)}px`}
                >
                  <Text
                    textAlign="center"
                    ml={`${hs(6)}px`}
                    fontStyle="italic"
                    fontWeight="light"
                    fontSize={`${ms(12)}px`}
                  >
                    {sportLevels[matchDetail.level]}
                  </Text>
                </Center>
              </Box>
            ) : null}
          </HStack>

          <HeadingWithText titleText={"Organizer"} marginVerticalview={hp(2)} marginLeftview={wp(3)} />

          <HStack borderColor={Colors.YELLOW} borderWidth={1} rounded="md" p={2} mx={`${wp(5)}px`}>
            <View style={[TabStyle.FlatinnerView, { width: wp(13) }]}>
              <Image
                rounded="full"
                width={`${hs(50)}px`}
                height={`${hs(50)}px`}
                source={
                  matchDetail.Organizer.profile_url ? { uri: matchDetail.Organizer.profile_url } : images.dummy_user_img
                }
              />
            </View>
            <View style={TabStyle.lineView} />
            <View style={{ marginHorizontal: wp(1) }}>
              <HStack space={1} alignItems="center">
                <FastImage
                  resizeMode="contain"
                  style={{ width: hs(20), height: hs(20) }}
                  source={images.tennis_img}
                ></FastImage>
                <Text numberOfLines={1} style={[{ fontSize: hs(20), fontWeight: "400" }]}>
                  {matchDetail.Organizer.name || matchDetail.Organizer.username}
                </Text>
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
                  {matchDetail.Organizer.location}
                </Text>
              </View>
              <View style={[TabStyle.rowFlexDiretion, { alignItems: "center", marginTop: hs(4) }]}>
                <Text numberOfLines={1} fontSize={`${ms(11)}px`} mr={1}>
                  Other sports
                </Text>

                {matchDetail.Organizer.assign_sport.slice(0, 3).map(() => (
                  <Image source={images.tennis_img} />
                ))}
              </View>
            </View>
          </HStack>

          <HeadingWithText titleText={"Confirmed Players"} marginVerticalview={hp(2)} marginLeftview={wp(3)} />

          <FlatList
            ml={`${wp(5)}px`}
            horizontal={true}
            data={[...matchDetail.confirmed_player, { name: "empty" }]}
            bounces={false}
            renderItem={({ item, index }) => {
              return (
                <Center
                  width={`${hs(84)}px`}
                  mx={2}
                  rounded="lg"
                  borderWidth={1}
                  borderColor="gray.700"
                  backgroundColor="white"
                >
                  {item.name === "empty" && matchDetail.open_sports > 0 ? (
                    <Text fontSize={`${ms(10)}px`} lineHeight={`${ms(28)}px`} textAlign="center">
                      {matchDetail.open_sports + " more \n open sports"}
                    </Text>
                  ) : (
                    <>
                      <Image
                        mt={2}
                        source={images.dummy_user_img}
                        width={`${hs(40)}px`}
                        height={`${hs(40)}px`}
                        resizeMode="contain"
                        resizeMethod="resize"
                        rounded="full"
                      />
                      <Text fontSize={`${ms(10)}px`}>{item.name || item.username + " " + item.age}</Text>
                      <Text fontSize={`${ms(8)}px`} textAlign="center">{`${item.city}, ${item.state}`}</Text>
                      <Text fontSize={`${ms(8)}px`} textAlign="center">{`(${
                        item.assign_sport.find(({ title, status }) => title === matchDetail.sport).status || "B"
                      }) ${matchDetail.sport}`}</Text>
                      <HStack my="1.5" space={`${hs(10)}px`} justifyContent="center">
                        <Button
                          _text={{ fontSize: `${ms(5)}px`, lineHeight: `${ms(9)}px` }}
                          p={0}
                          bgColor="blue.600"
                          rounded="full"
                          width={`${hs(50)}px`}
                          onPress={() => this.props.navigation.navigate("ChatListing")}
                        >
                          Message
                        </Button>
                      </HStack>
                    </>
                  )}
                </Center>
              );
            }}
          />

          <HStack justifyContent="center" width="full" my={6}>
            <Button
              bgColor={Colors.ORANGE}
              width="1/2"
              height={`${hs(27)}px`}
              _text={{ fontSize: `${ms(15)}px`, fontStyle: "italic", fontWeight: "light" }}
              py={0}
              onPress={() => this.gotoManagePlayers()}
            >
              Manage Players
            </Button>
          </HStack>
        </ScrollView>

        {this.props.isBusyDeleteMatch ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyDeleteMatch: state.app.isBusyDeleteMatch,
    responseDeleteMatchdata: state.app.responseDeleteMatchdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
    currentUser: state.auth.currentUser,
    isBusySentFriendRequest: state.app.isBusySentFriendRequest,
    responseSentFriendRequestdata: state.app.responseSentFriendRequestdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doDeleteMatch,
        doSentFriendRequest,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorDeleteMatchScreen);
