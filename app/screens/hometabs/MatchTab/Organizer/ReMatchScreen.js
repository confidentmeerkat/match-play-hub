import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import { ProfileStyle } from "../../../../../assets/styles/ProfileStyle";
import Header from "../../../../components/Header/Header";
import strings from "../../../../resources/languages/strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Calendar } from "react-native-calendars";
import Colors from "../../../../constants/Colors";
import { TimeSlider } from "../../../../components/RangeTimer/TimeSlider";
import images from "../../../../resources/images";
import FastImage from "react-native-fast-image";
import { AuthStyle } from "../../../../../assets/styles/AuthStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackgroundButton from "../../../../components/buttons/BackgroundButton";
import font_type from "../../../../resources/fonts";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../utils/helpers";
import HeadingWithText from "../../../../components/RenderFlatlistComponent/HeadingWithText";
import { doCreateRematch } from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import errors from "../../../../resources/languages/errors";
import Loader from "../../../../components/loaders/Loader";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as globals from "../../../../utils/Globals";
const TIME = { min: 0, max: 86399 };
const SliderPad = 12;
const { min, max } = TIME;

class ReMatchScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      markedDates: {},
      isVisibleDateTimeView: false,
      isStartDatePicked: false,
      isEndDatePicked: false,
      startDate: "",
      messages: "",
      calculatewidth: 310,
      selected: [min, max],
      playersList: [],
      matchDetail: props.route.params.matchDetail,
      convertedstartTime: "",
      convertedendTime: "",
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseRematchdata !== this.props.responseRematchdata) {
      if (this.props.responseRematchdata !== undefined) {
        const { success, message, status_code } =
          this.props.responseRematchdata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          EventRegister.emit("RefreshMatchList");
          this.props.navigation.navigate("MATCH");
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
    await this.updateMatchDetails();
  }

  componentWillUnmount() {}

  updateMatchDetails = () => {
    const { matchDetail } = this.state;

    this.setState({
      playersList: matchDetail.confirmed_player,
      // messages: matchDetail.message ? matchDetail.message : "",
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

  onDayPress = (day) => {
    let markedDates = {};
    markedDates[day.dateString] = {
      selected: true,
      selectedColor: Colors.PRIMARY,
      textColor: Colors.WHITE,
      selectedStartDate: day,
    };
    this.setState({
      markedDates: markedDates,
      startDate: day.dateString,
    });
  };

  // Callbacks
  onLayout = (event) => {
    this.setState({
      calculatewidth: event.nativeEvent.layout.width - SliderPad * 2,
    });
  };

  display(startTime, endTime) {
    const format = (val) => `0${Math.floor(val)}`.slice(-2);
    var startTimehours = startTime / 3600;
    var startTimeminutes = (startTime % 3600) / 60;
    var endTimehours = endTime / 3600;
    var endTimeminutes = (endTime % 3600) / 60;

    if (startTimeminutes <= 30) {
      startTimeminutes = 0;
    }
    if (startTimeminutes > 30) {
      startTimeminutes = 30;
    }

    if (endTimeminutes <= 30) {
      endTimeminutes = 0;
    }
    if (endTimeminutes > 30 && endTimeminutes != "59.983333333333334") {
      endTimeminutes = 30;
    }
    if (
      endTimehours == "23.99972222222222" &&
      endTimeminutes == "59.983333333333334"
    ) {
      endTimeminutes = 59;
    }

    return [
      [startTimehours, startTimeminutes].map(format).join(":"),
      [endTimehours, endTimeminutes].map(format).join(":"),
    ];
  }

  onValuesChangeFinish = (values) => {
    var startTime = values[0];
    var endTime = values[1];
    let convertedHours = this.display(startTime, endTime);
    const convertedstartTime = convertedHours[0];
    const convertedendTime = convertedHours[1];

    this.setState({
      convertedstartTime: convertedstartTime,
      convertedendTime: convertedendTime,
      selected: values,
    });
  };

  doClickCreateMatch = async () => {
    const {
      location,
      convertedendTime,
      convertedstartTime,
      selected,
      messages,
      markedDates,
      matchDetail,
    } = this.state;

    if (globals.isInternetConnected == true) {
      if (Object.keys(markedDates).length === 0) {
        showErrorMessage(errors.selectDate);
        return;
      }
      if (JSON.stringify(selected) == JSON.stringify([min, max])) {
        showErrorMessage(errors.selectTime);
        return;
      }
      if (convertedstartTime == convertedendTime) {
        showErrorMessage(errors.selectvalidtime);
        return;
      }
      let currentID;
      if (matchDetail.confirmed_player) {
        currentID = matchDetail.confirmed_player.map((item) => {
          return item.user_id;
        });
      }
      let params = {
        match_id: matchDetail.id,
        match_dates: Object.keys(markedDates),
        match_time: selected,
        invited_player: currentID,
        start_time: convertedstartTime,
        end_time: convertedendTime,
        messages: messages,
      };
      this.props.doCreateRematch(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  gotoMapScreen = () => {
    this.props.navigation.navigate("MapView", {
      matchDetail: this.state.matchDetail,
    });
  };

  doClickRecurringWeekly = () => {};

  handleDateTimeView = () => {
    this.setState({ isVisibleDateTimeView: !this.state.isVisibleDateTimeView });
  };

  renderplayersListview = (item, index) => {
    return (
      <View style={TabStyle.renderSportsFlatview}>
        <FastImage
          style={TabStyle.smallimgStyle}
          source={
            item.profile_url === ""
              ? images.dummy_user_img
              : { uri: item.profile_url }
          }
        ></FastImage>
      </View>
    );
  };

  render() {
    const {
      isVisibleDateTimeView,
      selected,
      calculatewidth,
      messages,
      markedDates,
      playersList,
      matchDetail,
    } = this.state;

    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={{ flex: 1 }}>
          <View style={[TabStyle.marginfromallside, { marginTop: 0 }]}>
            <View style={TabStyle.centerLocationtext}>
              <Text numberOfLines={1} style={[TabStyle.headertext]}>
                {matchDetail.sport ? matchDetail.sport : ""}
              </Text>
              <TouchableOpacity
                onPress={() => this.gotoMapScreen()}
                style={[TabStyle.rowFlexDiretion, { marginVertical: hp(0.5) }]}
              >
                <FastImage
                  resizeMode="contain"
                  tintColor={Colors.GREY}
                  style={[ProfileStyle.locationicon]}
                  source={images.fill_location_img}
                ></FastImage>

                <Text
                  numberOfLines={2}
                  style={[
                    TabStyle.smalltextview,
                    { color: Colors.PRIMARY, marginBottom: hp(0.5) },
                  ]}
                >
                  {matchDetail.location ? matchDetail.location : ""}
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={[TabStyle.rowFlexDiretion]}
                onPress={() => this.gotoMapScreen()}
              >
                <Text
                  numberOfLines={2}
                  style={[TabStyle.dayTimeView, { color: Colors.PRIMARY }]}
                >
                  {strings.viewonmap}
                </Text>

                <FastImage
                  resizeMode="contain"
                  tintColor={Colors.PRIMARY}
                  style={[TabStyle.verysmallIcon, { marginTop: 0 }]}
                  source={images.fill_next_img}
                ></FastImage>
              </TouchableOpacity> */}
            </View>
          </View>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={AuthStyle.scrollContentStyle}
          >
            <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}>
              <View
                style={[
                  TabStyle.dropdownmargins,
                  {
                    marginBottom: isVisibleDateTimeView ? hp(4) : 0,
                  },
                ]}
              >
                <TouchableOpacity
                  style={TabStyle.touchableview}
                  onPress={() => this.handleDateTimeView()}
                >
                  <Text style={TabStyle.chooseFontStyle}>
                    {strings.chooseDateandTime}
                  </Text>
                  <FastImage
                    style={[TabStyle.calenderDropDown]}
                    tintColor={Colors.BLACK}
                    source={images.down_arrow_img}
                  ></FastImage>
                </TouchableOpacity>
                {isVisibleDateTimeView ? (
                  <>
                    <Calendar
                      minDate={Date()}
                      monthFormat={"MMMM yyyy"}
                      markedDates={markedDates}
                      hideExtraDays={true}
                      pastScrollRange={0}
                      futureScrollRange={12}
                      // hideDayNames={true}
                      enableSwipeMonths={true}
                      onDayPress={this.onDayPress}
                      customStyle={{
                        currentDayText: {
                          color: Colors.PRIMARY,
                        },
                      }}
                      theme={{
                        arrowColor: Colors.PRIMARY,
                      }}
                    />

                    <TimeSlider
                      onLayout={() => this.onLayout}
                      width={calculatewidth}
                      selected={selected}
                      onValuesChangeFinish={this.onValuesChangeFinish}
                    />
                  </>
                ) : null}
              </View>

              <View style={TabStyle.dropdownmargins}>
                <View style={[TabStyle.dropDownbtnStyle, {}]}>
                  <TextInput
                    value={messages}
                    ref={(ref) => (this.messagesRef = ref)}
                    blurOnSubmit={false}
                    autoCapitalize={"none"}
                    onChangeText={(text) => {
                      this.setState({
                        messages: text,
                      });
                    }}
                    placeholderTextColor={Colors.BLACK}
                    returnKeyType="done"
                    placeholder="Match Description"
                    maxLength={1000}
                    multiline={true}
                    numberOfLines={6}
                    style={[
                      AuthStyle.textInputStyle,
                      {
                        width: "100%",
                        paddingHorizontal: 6,
                      },
                    ]}
                    onSubmitEditing={() => {
                      this.messagesRef.blur();
                    }}
                  />
                </View>
              </View>
              {/* <View
                style={[
                  AuthStyle.loginView,
                  { marginTop: hp(1), marginBottom: hp(4) },
                ]}
              >
                <TouchableOpacity onPress={() => this.doClickRecurringWeekly()}>
                  <BackgroundButton
                    title={strings.recurringWeekly}
                    backgroundColor={Colors.WHITE}
                    borderColor={Colors.GREY}
                    borderWidth={0.3}
                    borderRadius={14}
                    isImage={true}
                    btnImage={images.repeat_img}
                    textColor={Colors.DARK_GREY}
                    fontFamily={font_type.FontSemiBold}
                    fontSize={RFPercentage(2.5)}
                    height={hp(7)}
                    width={wp(90)}
                  />
                </TouchableOpacity>
              </View> */}

              <View style={[TabStyle.dropdownmargins, { marginBottom: hp(4) }]}>
                <HeadingWithText
                  titleText={strings.players}
                  marginVerticalview={hp(1)}
                />
                <FlatList
                  data={playersList}
                  renderItem={({ item, index }) =>
                    this.renderplayersListview(item, index)
                  }
                  bounces={false}
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  listKey={(item, index) => "D" + index.toString()}
                  keyExtractor={(item, index) => "D" + index.toString()}
                />
              </View>

              <View
                style={[
                  AuthStyle.loginView,
                  { marginTop: hp(1.5), marginBottom: hp(3) },
                ]}
              >
                <TouchableOpacity onPress={() => this.doClickCreateMatch()}>
                  <BackgroundButton
                    title={strings.createMatch}
                    backgroundColor={Colors.PRIMARY}
                    borderRadius={14}
                    textColor={Colors.WHITE}
                    fontFamily={font_type.FontSemiBold}
                    fontSize={RFPercentage(2.5)}
                    height={hp(7)}
                    width={wp(90)}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
        {this.props.isBusyRematch ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyRematch: state.app.isBusyRematch,
    responseRematchdata: state.app.responseRematchdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doCreateRematch,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReMatchScreen);
