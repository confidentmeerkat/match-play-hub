import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Settingstyle } from "../../../../../assets/styles/Settingstyle";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
  TextInput,
  View,
  Platform,
  Linking,
  PermissionsAndroid,
} from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import Header from "../../../../components/Header/Header";
import strings from "../../../../resources/languages/strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import Colors from "../../../../constants/Colors";
import { TimeSlider } from "../../../../components/RangeTimer/TimeSlider";
import images from "../../../../resources/images";
import FastImage from "react-native-fast-image";
import CustomDropDownPicker from "../../../../components/Dropdowns/CustomDropDownPicker";
import { DefaultPlayer } from "../../../../constants/DefaultPlayer";
import { AuthStyle } from "../../../../../assets/styles/AuthStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackgroundButton from "../../../../components/buttons/BackgroundButton";
import font_type from "../../../../resources/fonts";
import { RFPercentage } from "react-native-responsive-fontsize";
import SwitchComponent from "../../../../components/Switch/SwitchComponent";
import {
  doPostUpdateMatch,
  doGetMatchDetail,
  doGetSportsTitleAndCateGory,doCreateRematch
} from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import {
  showSuccessMessage,
  showErrorMessage,
  removeEmojis,
} from "../../../../utils/helpers";
import NetworkUtills from "../../../../utils/NetworkUtills";
import errors from "../../../../resources/languages/errors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";
import * as globals from "../../../../utils/Globals";
import Loader from "../../../../components/loaders/Loader";
import Geolocation from "react-native-geolocation-service";
import CommonGooglePlaceAutoComplete from "../../../../components/Dropdowns/CommonGooglePlaceAutoComplete";
import { EventRegister } from "react-native-event-listeners";
import MultiSelectDropDown from "../../../../components/Dropdowns/MultiSelectDropDown";
import { GenderMultipleOptions } from "../../../../constants/GenderMultipleOptions";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AgeMultipleOptions } from "../../../../constants/AgeMultipleOptions";
import ReactModal from "react-native-modal";
import { ProfileStyle } from "../../../../../assets/styles/ProfileStyle";

const TIME = { min: 0, max: 86399 };
const SliderPad = 12;
const { min, max } = TIME;

class EditMatchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markedDates: {},
      isSportsPicker: false,
      matchDetail: props.route.params.matchDetail,
      isFrom: props.route.params.isFrom,
      isHideNotification: false,
      isVisibleDateTimeView: false,

      isStartDatePicked: false,
      isEndDatePicked: false,
      startDate: "",
      location: "",
      crrntLong: 0,
      crrntLat: 0,
      messages: "",
      locationdec: "",
      selectedPlayerId: [],

      calculatewidth: 310,
      selected: [min, max],
      sportsTitle: [],
      sportsOptionsData: [
        {
          title: "B",
          id: 0,
          isChecked: false,
        },
        {
          title: "I",
          id: 1,
          isChecked: false,
        },
        {
          title: "A",
          id: 2,
          isChecked: false,
        },
        {
          title: "P",
          id: 3,
          isChecked: false,
        },
      ],
      selectedSport: "",
      selectedGender: [],
      selectedLevel: "",
      selectedAge: [],
      selectedGame: "",
      selectedPlayerLimit: "",
      selectedCost: "",
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
          // this.props.navigation.navigate("MATCH");
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

    if (
      prevProps.responseGetTitleAndCategorydata !==
      this.props.responseGetTitleAndCategorydata
    ) {
      if (this.props.responseGetTitleAndCategorydata !== undefined) {
        const { success, message, sports, status_code } =
          this.props.responseGetTitleAndCategorydata;
        if (status_code == 200 && success == true) {
          this.setSportsTitle(sports);
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
      prevProps.responseGetMatchDetaildata !==
      this.props.responseGetMatchDetaildata
    ) {
      if (this.props.responseGetMatchDetaildata !== undefined) {
        const { success, message, error, upcomingMatch, status_code } =
          this.props.responseGetMatchDetaildata;
        if (status_code == 200 && success == true) {
          if (upcomingMatch) {
            this.setMatchDetail(upcomingMatch);
          }
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
      prevProps.responseUpdateMatchdata !== this.props.responseUpdateMatchdata
    ) {
      if (this.props.responseUpdateMatchdata !== undefined) {
        const { success, message, error, status_code, finalMatchData } =
          this.props.responseUpdateMatchdata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          // this.props.navigation.navigate("MATCH");
          this.props.navigation.goBack();
          EventRegister.emit("RefreshMatchList");
          EventRegister.emit("UpdateMatchList", {
            updatedMatchData: finalMatchData,
          });
        } else if (success == false) {
          if (error) {
            if (error.cost) {
              showErrorMessage(error.cost);
            } else if (error.player_limit) {
              showErrorMessage(error.player_limit);
            } else if (error.match_dates) {
              showErrorMessage(error.match_dates);
            } else if (error.sport) {
              showErrorMessage(error.sport);
            } else if (error.match_time) {
              showErrorMessage(error.match_time);
            } else if (error.location) {
              showErrorMessage(error.location);
            }
          } else if (status_code == 401 && message == "Token has expired") {
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
    await this.getApiToken();
    await this.getSportsTitles();
    this.getMatchDetails();
    // if (Platform.OS == "android") this.requestLocationPermission();
    // else this.hasLocationPermissionIOS();
  }

  // clear all states after leave this screen
  clearStates() {
    this.setState({
      markedDates: {},
      isSportsPicker: false,
      isHideNotification: false,
      isVisibleDateTimeView: false,
      isStartDatePicked: false,
      isEndDatePicked: false,
      startDate: "",
      location: "",
      crrntLong: 0,
      crrntLat: 0,
      messages: "",
      locationdec: "",
      selectedPlayerId: [],
      calculatewidth: 310,
      convertedstartTime: "",
      convertedendTime: "",
      selected: [min, max],
      sportsTitle: [],
      sportsOptionsData: [
        {
          title: "B",
          id: 0,
          isChecked: false,
        },
        {
          title: "I",
          id: 1,
          isChecked: false,
        },
        {
          title: "A",
          id: 2,
          isChecked: false,
        },
        {
          title: "P",
          id: 3,
          isChecked: false,
        },
      ],
      selectedSport: "",
      selectedGender: [],
      selectedLevel: "",
      selectedAge: [],
      selectedGame: "",
      selectedPlayerLimit: "",
      selectedCost: "",
    });
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setGrantedPermission(true);
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  }

  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");

    if (status === "granted") {
      return true;
    }

    if (status === "denied") {
      Alert.alert(
        `Turn on Location Services to allow MatchPlayHub App to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ]
      );
    }

    if (status === "disabled") {
      Alert.alert(
        `Turn on Location Services to allow MatchPlayHub App to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ]
      );
    }
    return false;
  };

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  getMatchDetails = async () => {
    const { matchDetail } = this.state;

    if (globals.isInternetConnected == true) {
      let params = {
        match_id: matchDetail.id,
      };
      this.props.doGetMatchDetail(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  getSportsTitles = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doGetSportsTitleAndCateGory();
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setSportsTitle = (sports) => {
    this.setState({ sportsTitle: sports });
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

  setMatchDetail = (matchDetail) => {
    const { isFrom } = this.state;
    let markedDates = {};
    if (matchDetail.date) {
      markedDates[matchDetail.date] = {
        selected: true,
        selectedColor: Colors.PRIMARY,
        textColor: Colors.WHITE,
        selectedStartDate: matchDetail.date,
      };
    }

    let formattedAge;
    if (matchDetail.age.length > 0) {
      var data = JSON.parse(matchDetail.age);
      var b = JSON.stringify(data);
      formattedAge = b.replace(/\\/g, "");
    }

    let formattedGender;
    if (matchDetail.gender.length > 0) {
      var data = JSON.parse(matchDetail.gender);
      var b = JSON.stringify(data);
      formattedGender = b.replace(/\\/g, "");
    }

    this.setState({
      selectedPlayerId: matchDetail.invited_player
        ? matchDetail.invited_player
        : [],
      selectedCost: matchDetail.cost ? matchDetail.cost : "",
      selectedPlayerLimit: matchDetail.player_limit
        ? matchDetail.player_limit
        : "",
      // selectedGame: matchDetail.cost ? matchDetail.cost : "",
      selectedAge: matchDetail.age.length > 0 ? JSON.parse(formattedAge) : [],
      selectedGender:
        matchDetail.gender.length > 0 ? JSON.parse(formattedGender) : [],
      selectedSport: matchDetail.sport ? matchDetail.sport : "",
      selected:
        isFrom == "rematch"
          ? [min, max]
          : matchDetail.match_time_array
          ? matchDetail.match_time_array
          : "",
      isHideNotification: matchDetail.find_match == "1" ? true : false,
      location: matchDetail.location ? matchDetail.location : "",
      selectedLevel: matchDetail.level ? matchDetail.level : "",
      messages:
        isFrom == "rematch"
          ? ""
          : matchDetail.message
          ? matchDetail.message
          : "",
      markedDates:
        isFrom == "rematch" ? {} : matchDetail.date ? markedDates : "",
      crrntLong: matchDetail.longitude ? matchDetail.longitude : "",
      crrntLat: matchDetail.latitude ? matchDetail.latitude : "",
      convertedstartTime: matchDetail.start_time ? matchDetail.start_time : "",
      convertedendTime: matchDetail.end_time ? matchDetail.end_time : "",
      locationdec: matchDetail.location_description
        ? matchDetail.location_description
        : "",
    });
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

  handleDateTimeView = () => {
    this.setState({ isVisibleDateTimeView: !this.state.isVisibleDateTimeView });
  };

  onSelectGameDropDown = (selectedItem) => {
    this.setState({ selectedGame: selectedItem });
  };

  onSelectPlayerLimitDropDown = (selectedItem) => {
    this.setState({ selectedPlayerLimit: selectedItem });
  };

  onSelectCostDropDown = (selectedItem) => {
    this.setState({ selectedCost: selectedItem });
  };

  changeHideNotification() {
    this.setState({ isHideNotification: !this.state.isHideNotification });
  }

  PlayersLimit = (data) => {
    this.setState({ selectedPlayerId: data });
  };

  handleOnLocationSelect = (details) => {
    if (details) {
      if (
        details.geometry != undefined &&
        details.geometry.location != undefined &&
        details.formatted_address != undefined
      ) {
        this.setState({
          crrntLat: details.geometry.location.lat,
          crrntLong: details.geometry.location.lng,
          location: details.formatted_address,
        });
      }
    }
  };

  onSelectedGenderItemsChange = (selectedRooms) => {
    this.setState({ selectedGender: selectedRooms });
  };

  onSelectedAgeItemsChange = (selectedRooms) => {
    this.setState({ selectedAge: selectedRooms });
  };

  onSelectedAgeRoomChange = (selectedRooms) => {
    this.setState({ selectedAge: selectedRooms });
  };

  onSelectedGenderRoomChange = (selectedRooms) => {
    this.setState({ selectedGender: selectedRooms });
  };

  formatForMultiSelectAge(arr) {
    var temp = [];
    arr.filter((item) => {
      temp.push(item.id);
    });
    return temp;
  }

  formatForMultiSelectGender(arr) {
    var temp = [];
    arr.filter((item) => {
      temp.push(item.id);
    });
    return temp;
  }

  doClickCreateMatch = async (status) => {
    const {
      location,
      isHideNotification,
      selected,
      selectedCost,
      messages,
      selectedGame,
      selectedPlayerLimit,
      markedDates,
      selectedSport,
      selectedGender,
      selectedAge,
      selectedLevel,
      selectedPlayerId,
      crrntLat,
      crrntLong,
      matchDetail,
      convertedendTime,
      convertedstartTime,
      locationdec,
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
      if (selectedSport.trim() === "") {
        showErrorMessage(errors.selectSport);
        return;
      }
      if (selectedPlayerLimit === "") {
        showErrorMessage(errors.selectPlayers);
        return;
      }

      if (location.trim() === "") {
        showErrorMessage(errors.selectLocation);
        return;
      }
      if (crrntLong == 0 || crrntLat == 0) {
        showErrorMessage(errors.selectvalidLocation);
        return;
      }
      if (!removeEmojis(location).length) {
        showErrorMessage(errors.emojinotallow);
        return;
      }
      if (selectedPlayerLimit < matchDetail.confirmed) {
        showErrorMessage(
          "You can't decrease player limit as you already have " +
            matchDetail.confirmed +
            " confirmed player"
        );
        return;
      }
      if (status == "InvitePlayers") {
        this.props.navigation.navigate("InviteFriends", {
          PlayersLimit: this.PlayersLimit,
          currentPlayersLimit: selectedPlayerLimit,
          isFrom: "EditMatch",
          matchDetail: this.state.matchDetail,
        });
      } else {
        const params = {
          match_id: matchDetail.id,
          sport: selectedSport,
          level: selectedLevel,
          gender: JSON.stringify(selectedGender),
          age: JSON.stringify(selectedAge),
          pickup_game: selectedGame,
          location: location,
          longitude: crrntLong,
          latitude: crrntLat,
          player_limit: selectedPlayerLimit,
          cost: selectedCost,
          message: messages,
          find_match: isHideNotification == false ? "0" : "1",
          match_dates: Object.keys(markedDates),
          match_time: selected,
          start_time: convertedstartTime,
          end_time: convertedendTime,
          invited_player: selectedPlayerId,
          location_description: locationdec,
        };
        this.props.doPostUpdateMatch(params);
      }
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  doClickCreateReMatch = () => {
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

  onCkeckedSportsLevel = (item, index) => {
    const { sportsOptionsData } = this.state;
    sportsOptionsData.map((lvl, lvlIndex) => {
      if (lvlIndex == index) {
        this.setState({ selectedLevel: lvl.title });
        lvl.isChecked = true;
      } else {
        lvl.isChecked = false;
      }
    });
    this.setState({ sportsOptionsData }, () => {
      this.forceUpdate();
    });
  };

  onLongCkeckedSportsLevel = (item, index) => {
    const { sportsOptionsData } = this.state;
    sportsOptionsData.map((lvl, lvlIndex) => {
      if (lvlIndex == index) {
        this.setState({ selectedLevel: "" });
        lvl.isChecked = false;
      }
    });
    this.setState({ sportsOptionsData }, () => {
      this.forceUpdate();
    });
  };

  renderSportsOptionsview = (item, index) => {
    const { selectedLevel } = this.state;
    return (
      <TouchableOpacity
        key={index}
        delayLongPress={800}
        onLongPress={() => this.onLongCkeckedSportsLevel(item, index)}
        onPress={() => this.onCkeckedSportsLevel(item, index)}
        style={[
          TabStyle.roundedview,
          {
            alignSelf: "flex-end",
            borderWidth: item.isChecked || selectedLevel == item.title ? 2 : 0,
            borderColor:
              item.isChecked || selectedLevel == item.title
                ? Colors.PRIMARY
                : Colors.WHISPER,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            TabStyle.sportstitleview,
            {
              fontFamily:
                item.isChecked || selectedLevel == item.title
                  ? font_type.FontExtraBold
                  : font_type.FontRegular,
              color:
                item.isChecked || selectedLevel == item.title
                  ? Colors.BLACK
                  : Colors.GREY,
              textAlign: "center",
            },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  onChangeTexttoRemove = (text) => {
    this.setState({ location: text });
  };

  //display sports picker model
  displaySportsPicker = () => {
    this.setState({ isSportsPicker: !this.state.isSportsPicker });
  };

  renderListFooterComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => this.displaySportsPicker()}
        style={TabStyle.closebtnofmodel}
      >
        <Text
          numberOfLines={1}
          style={[ProfileStyle.smalltextview, { color: Colors.WHITE }]}
        >
          {strings.btn_close}
        </Text>
      </TouchableOpacity>
    );
  };

  onCkeckedSports = (row, innerindex) => {
    const { sportsTitle } = this.state;
    let sportData = sportsTitle;
    for (let i = 0; i < sportData.length; i++) {
      let data = sportData[i];

      data.children.map((lvl, dindex) => {
        if (innerindex == dindex && lvl.name == row.name) {
          this.setState({ selectedSport: lvl.name });
          lvl.isChecked = true;
        } else {
          lvl.isChecked = false;
        }
      });
    }
    this.setState({ sportsTitle }, () => {
      this.forceUpdate();
    });
  };

  renderSportCategoryview = (item, outerindex) => {
    let items = [];

    if (item.children) {
      items = item.children.map((row, innerindex) => {
        return (
          <TouchableOpacity
            onPress={() => this.onCkeckedSports(row, innerindex)}
            key={innerindex}
            style={[
              ProfileStyle.sportstitleviewbefore,
              {
                marginHorizontal: wp(2),
                justifyContent: "space-between",
                backgroundColor: row.isChecked
                  ? Colors.LITE_GREY
                  : Colors.WHITE,
                paddingVertical: hp(0.5),
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                ProfileStyle.sportstitleview,
                { fontFamily: font_type.FontSemiBold, color: Colors.BLACK },
              ]}
            >
              {row.name}
            </Text>
            {row.isChecked ? (
              <FastImage
                style={[TabStyle.calenderDropDown]}
                tintColor={Colors.PRIMARY}
                source={images.rightsign_img}
              ></FastImage>
            ) : null}
          </TouchableOpacity>
        );
      });
    }

    return (
      <>
        <View
          key={outerindex}
          style={[ProfileStyle.headerTitleView, { marginHorizontal: wp(2) }]}
        >
          <Text
            numberOfLines={1}
            style={[ProfileStyle.headertext, { color: Colors.PRIMARY }]}
          >
            {item.name}
          </Text>
        </View>
        {items}
      </>
    );
  };

  render() {
    const {
      location,
      isHideNotification,
      isVisibleDateTimeView,
      selected,
      calculatewidth,
      messages,
      markedDates,
      selectedPlayerLimit,
      sportsTitle,
      sportsOptionsData,
      selectedCost,
      selectedLevel,
      selectedGame,
      selectedAge,
      selectedSport,
      selectedGender,
      locationdec,
      isFrom,
      isSportsPicker,
    } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <ReactModal
          animationType="slide"
          transparent={true}
          isVisible={isSportsPicker}
          onBackdropPress={() => this.displaySportsPicker()}
          backdropColor={"rgba(58, 58, 58, 0.8)"}
          backdropOpacity={10}
        >
          <View style={TabStyle.sportsmodel}>
            <FlatList
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 5 }}
              style={{ flexGrow: 1 }}
              data={sportsTitle}
              scrollEnabled={true}
              extraData={sportsTitle}
              renderItem={({ item, index }) =>
                this.renderSportCategoryview(item, index)
              }
              bounces={false}
              showsVerticalScrollIndicator={false}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            ></FlatList>
            {this.renderListFooterComponent()}
          </View>
        </ReactModal>
        <View style={TabStyle.onlyFlex}>
          <View style={TabStyle.calendarContainer}>
            <CommonGooglePlaceAutoComplete
              handleOnLocationSelect={(data, details = null) => {
                this.handleOnLocationSelect(details);
              }}
              handletextInputProps={{
                value: location,
                placeholderTextColor: Colors.BLACK,
                onChangeText: (text) => {
                  this.onChangeTexttoRemove(text);
                },
              }}
              placeholder={location ? "Location : " + location : "Location"}
              isFrom="Match"
            />
          </View>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            automaticallyAdjustContentInsets={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"handled"}
          >
            <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}>
              <View style={TabStyle.dropdownmargins}>
                <View
                  style={[
                    AuthStyle.aboutview,
                    {
                      marginStart: 2,
                      marginEnd: 2,
                      marginTop: 0,
                      marginBottom: 10,
                    },
                  ]}
                >
                  <TextInput
                    value={locationdec}
                    ref={(ref) => (this.locationdecRef = ref)}
                    blurOnSubmit={false}
                    autoCapitalize={"none"}
                    onChangeText={(text) => {
                      this.setState({
                        locationdec: text,
                      });
                    }}
                    placeholderTextColor={Colors.BLACK}
                    returnKeyType="done"
                    placeholder="Location Description"
                    maxLength={1000}
                    multiline={true}
                    numberOfLines={5}
                    style={[
                      AuthStyle.textInputStyle,
                      {
                        width: "100%",
                        paddingLeft: 6,
                        marginLeft: 3,
                        height: 80,
                      },
                    ]}
                    onSubmitEditing={() => {
                      this.locationdecRef.blur();
                    }}
                  />
                </View>
              </View>

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
              <View style={[TabStyle.dropdownmargins]}>
                <TouchableOpacity
                  style={TabStyle.touchableview}
                  onPress={() => this.displaySportsPicker()}
                >
                  <Text style={TabStyle.chooseFontStyle}>
                    {selectedSport ? "Sport: " + selectedSport : "Sport"}
                  </Text>
                  <FastImage
                    style={[TabStyle.calenderDropDown]}
                    tintColor={Colors.BLACK}
                    source={images.down_arrow_img}
                  ></FastImage>
                </TouchableOpacity>
              </View>

              <View style={[TabStyle.LevelHorizontalView]}>
                <Text
                  style={[
                    TabStyle.chooseFontStyle,
                    { width: "35%", marginLeft: wp(2) },
                  ]}
                >
                  {"Skill Level"}
                </Text>

                <FlatList
                  style={[TabStyle.onlyFlex]}
                  data={sportsOptionsData}
                  renderItem={({ item, index }) =>
                    this.renderSportsOptionsview(item, index)
                  }
                  extraData={sportsOptionsData}
                  bounces={false}
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  listKey={(item, index) => "D" + index.toString()}
                  keyExtractor={(item, index) => "D" + index.toString()}
                />
              </View>

              {/* <View style={TabStyle.dropdownmargins}>
                <CustomDropDownPicker
                  onSelect={(selectedItem) =>
                    this.onSelectGameDropDown(selectedItem)
                  }
                  defaultButtonText={"Game"}
                  data={["Pick Up Game", "Organized Game"]}
                  buttonTextAfterSelection={(selectedItem) => {
                    return "Game : " + selectedItem;
                  }}
                />
              </View> */}

              <View style={TabStyle.dropdownmargins}>
                <CustomDropDownPicker
                  onSelect={(selectedItem) =>
                    this.onSelectPlayerLimitDropDown(selectedItem)
                  }
                  defaultButtonText={
                    selectedPlayerLimit
                      ? "Number of Players: " + selectedPlayerLimit
                      : "Number of Players"
                  }
                  data={DefaultPlayer}
                  buttonTextAfterSelection={(selectedItem) => {
                    return "Number of Players: " + selectedItem;
                  }}
                />
              </View>

              <View
                style={[
                  TabStyle.dropdownmargins,
                  {
                    backgroundColor: Colors.LITE_GREY,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: Colors.LITE_GREY,
                  },
                ]}
              >
                <MultiSelectDropDown
                  Options={GenderMultipleOptions}
                  Icon={Icon}
                  onSelectedAvailibilityItemsChange={
                    this.onSelectedGenderItemsChange
                  }
                  onSelectedRoomChange={this.onSelectedGenderRoomChange}
                  selectedItems={this.formatForMultiSelectGender(
                    selectedGender
                  )}
                  selectText="Gender"
                  subKey="children"
                />
              </View>

              <View
                style={[
                  TabStyle.dropdownmargins,
                  {
                    backgroundColor: Colors.LITE_GREY,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: Colors.LITE_GREY,
                  },
                ]}
              >
                <MultiSelectDropDown
                  Options={AgeMultipleOptions}
                  Icon={Icon}
                  onSelectedAvailibilityItemsChange={
                    this.onSelectedAgeItemsChange
                  }
                  onSelectedRoomChange={this.onSelectedAgeRoomChange}
                  selectedItems={this.formatForMultiSelectAge(selectedAge)}
                  selectText="Age Range"
                  subKey="children"
                />
              </View>

              <View style={TabStyle.dropdownmargins}>
                <CustomDropDownPicker
                  onSelect={(selectedItem) =>
                    this.onSelectCostDropDown(selectedItem)
                  }
                  defaultButtonText={
                    selectedCost ? "Cost: " + selectedCost : "Cost"
                  }
                  data={[" ", "Free", "$"]}
                  buttonTextAfterSelection={(selectedItem) => {
                    return selectedItem.trim() == ""
                      ? "Cost" + selectedItem
                      : "Cost: " + selectedItem;
                  }}
                />
              </View>

              <View style={TabStyle.dropdownmargins}>
                <View
                  style={[
                    AuthStyle.aboutview,
                    {
                      marginStart: 2,
                      marginEnd: 2,
                      marginTop: 0,
                      marginBottom: 10,
                    },
                  ]}
                >
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
                    numberOfLines={5}
                    style={[
                      AuthStyle.textInputStyle,
                      {
                        width: "100%",
                        paddingLeft: 6,
                        height: 80,
                      },
                    ]}
                    onSubmitEditing={() => {
                      this.messagesRef.blur();
                    }}
                  />
                </View>
              </View>
              <View style={[Settingstyle.globalPostview]}>
                <FastImage
                  resizeMethod="resize"
                  tintColor={Colors.PRIMARY}
                  style={TabStyle.smallIconStyle}
                  source={images.global_img}
                ></FastImage>
                <Text
                  style={[
                    TabStyle.smallheadertext,
                    { textAlign: "left", marginBottom: 0, width: wp(60) },
                  ]}
                >
                  {strings.postToFindMatch}
                </Text>
                <View
                  style={[
                    Settingstyle.nextview,
                    { padding: 0, marginLeft: wp(5) },
                  ]}
                >
                  <SwitchComponent
                    value={isHideNotification}
                    onValueChange={() => this.changeHideNotification()}
                  />
                </View>
              </View>
              <View style={[AuthStyle.loginView, { marginTop: hp(1) }]}>
                <TouchableOpacity
                  onPress={() => this.doClickCreateMatch("InvitePlayers")}
                >
                  <BackgroundButton
                    title={strings.invitePlayers}
                    backgroundColor={Colors.WHITE}
                    borderColor={Colors.GREY}
                    borderWidth={0.3}
                    borderRadius={14}
                    isImage={true}
                    btnImage={images.allUsers_img}
                    textColor={Colors.DARK_GREY}
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
        <View
          style={[
            AuthStyle.loginView,
            { marginTop: hp(1.5), marginBottom: hp(3) },
          ]}
        >
          <TouchableOpacity
            onPress={() =>
              isFrom == "rematch"
                ? this.doClickCreateReMatch()
                : this.doClickCreateMatch("UpdateMatch")
            }
          >
            <BackgroundButton
              title={
                isFrom == "rematch" ? strings.creatematch : strings.updatematch
              }
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
        {this.props.isBusyGetMatchDetail ||
        this.props.isBusyRematch ||
        this.props.isBusyUpdateMatch ? (
          <Loader />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyGetMatchDetail: state.app.isBusyGetMatchDetail,
    responseGetMatchDetaildata: state.app.responseGetMatchDetaildata,
    isBusyUpdateMatch: state.app.isBusyUpdateMatch,
    responseUpdateMatchdata: state.app.responseUpdateMatchdata,
    isBusyGetTitleAndCategory: state.app.isBusyGetTitleAndCategory,
    responseGetTitleAndCategorydata: state.app.responseGetTitleAndCategorydata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    responseUserdata: state.auth.responseUserdata,
    isBusyRematch: state.app.isBusyRematch,
    responseRematchdata: state.app.responseRematchdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doGetMatchDetail,
        doPostUpdateMatch,
        doGetSportsTitleAndCateGory,
        doCreateRematch,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMatchScreen);
