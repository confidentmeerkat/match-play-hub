import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
  View,
  Keyboard,
  Platform,
} from "react-native";
import strings from "../../../../resources/languages/strings";
import BackgroundButton from "../../../../components/buttons/BackgroundButton";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import { AuthStyle } from "../../../../../assets/styles/AuthStyle";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import { DefaultPlayer } from "../../../../constants/DefaultPlayer";
import font_type from "../../../../resources/fonts";
import {
  doGetSportsTitleAndCateGory,
  doFindMatch,
} from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../utils/helpers";
import CustomDropDownPicker from "../../../../components/Dropdowns/CustomDropDownPicker";
import errors from "../../../../resources/languages/errors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";
import * as globals from "../../../../utils/Globals";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import Colors from "../../../../constants/Colors";
import { TimeSlider } from "../../../../components/RangeTimer/TimeSlider";
import { RFPercentage } from "react-native-responsive-fontsize";
import { EventRegister } from "react-native-event-listeners";
import MultiSelectDropDown from "../../../../components/Dropdowns/MultiSelectDropDown";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AgeMultipleOptions } from "../../../../constants/AgeMultipleOptions";
import CommonGooglePlaceAutoComplete from "../../../../components/Dropdowns/CommonGooglePlaceAutoComplete";
import { GenderMultipleOptions } from "../../../../constants/GenderMultipleOptions";

const TIME = { min: 0, max: 86399 };
const SliderPad = 12;
const { min, max } = TIME;

class FindMatchFilterScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markedDates: {},
      currentUser: {},
      isStartDatePicked: false,
      isEndDatePicked: false,
      startDate: "",
      calculatewidth: 310,
      defaultselected: [min, max],
      selected: [min, max],
      selectedDistance: "",
      sportsTitle: [],
      defaultSportsOption: [
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
      selectedSport: [],
      isSelectedSports: false,
      selectedGender: [],
      selectedLevel: [],
      selectedAge: [],
      selectedGame: "",
      selectedPlayerLimit: "",
      selectedCost: "",
      location: "",
      crrntLong: 0,
      crrntLat: 0,

      finalObject: [],
      selectedFilters: 0,
      isFilterEnable: 0,
      convertedstartTime: "",
      convertedendTime: "",
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
            this.props.props.navigation.navigate("MatchWithListing", {
              filteredmatchData: matchData,
              locationInfo: locationInfo,
              searchData: searchData,
            });
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
          } else if (status_code == 400 || status_code == 422) {
            showErrorMessage(message);
          } else {
          }
        }
      }
    }
    if (
      prevProps.responseGetTitleAndCategorydata !==
      this.props.responseGetTitleAndCategorydata
    ) {
      if (this.props.responseGetTitleAndCategorydata !== undefined) {
        const { success, message, status_code, sports } =
          this.props.responseGetTitleAndCategorydata;

        if (status_code == 200 && success == true) {
          this.setSportsTitle(sports);
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            showErrorMessage(message);
            this.clearUserData();
            this.props.props.navigation.navigate("AuthLoading");
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
            this.props.props.navigation.navigate("AuthLoading");
          } else {
          }
        }
      }
    }
  }

  async componentDidMount() {
    this.getApiToken();
    await this.getSportsTitles();
    if (this.props.currentUser !== undefined) {
      this.setCurrentUser();
    }
    this.listenerone = EventRegister.addEventListener(
      "RefreshMatchFilter",
      ({ finalObject }) => {
        this.setState(
          {
            finalObject: finalObject,
          },
          () => {
            this.setfinalObjects();
          }
        );
      }
    );
  }

  setCurrentUser = () => {
    this.setState(
      {
        currentUser: this.props.currentUser,
      },
      () => {
        this.setfinalObjects();
      }
    );
  };

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listenerone);
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  getSportsTitles = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doGetSportsTitleAndCateGory();
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  setfinalObjects = () => {
    const { finalObject, currentUser, defaultSportsOption, defaultselected } =
      this.state;

    let markedDates = {};
    if (finalObject.length == 0) {
      let formattedAge;
      if (currentUser.age_preference.length > 0) {
        var data = JSON.parse(currentUser.age_preference);
        var b = JSON.stringify(data);
        formattedAge = b.replace(/\\/g, "");
      }
      console.log("currentUser--", currentUser);

      this.setState({
        selectedSport:currentUser.assignSportCategory? currentUser.assignSportCategory: [],
        selectedGender:
          currentUser.gender_json.length > 0 ? currentUser.gender_json : [],

        selectedAge: JSON.parse(formattedAge),
        selectedDistance: currentUser.distance ? currentUser.distance : "",
        location: currentUser.location ? currentUser.location : "",
        crrntLong: currentUser.longitude ? currentUser.longitude : "",
        crrntLat: currentUser.latitude ? currentUser.latitude : "",
      });
    } else {
      if (finalObject.match_dates.length == 0) {
        this.setState({ markedDates: {}, isStartDatePicked: false });
      } else {
        if (this.state.isStartDatePicked == false) {
          finalObject.match_dates.map((item) => {
            markedDates[item] = {
              selected: true,
              selectedColor: Colors.PRIMARY,
              textColor: Colors.WHITE,
              color: Colors.PRIMARY,
            };
          });
          this.setState({
            markedDates: markedDates,
            isStartDatePicked: true,
            isEndDatePicked: true,
            startDate: finalObject.match_dates[0],
          });
        }
      }

      let formattedAge;
      if (finalObject.age_preference.length > 0) {
        var data = JSON.parse(finalObject.age_preference);
        var b = JSON.stringify(data);
        formattedAge = b.replace(/\\/g, "");
      }

      let formattedSports;
      if (finalObject.sport.length > 0) {
        var data = JSON.parse(finalObject.sport);
        var b = JSON.stringify(data);
        formattedSports = b.replace(/\\/g, "");
      }

      let formattedGender;
      if (finalObject.gender.length > 0) {
        var data = JSON.parse(finalObject.gender);
        var b = JSON.stringify(data);
        formattedGender = b.replace(/\\/g, "");
      }

      this.setState({
        selectedSport:
          finalObject.sport.length > 0 ? JSON.parse(formattedSports) : [],
        selectedGender:
          finalObject.gender.length > 0 ? JSON.parse(formattedGender) : [],
        sportsOptionsData:
          finalObject.selectedLevel.length == 0
            ? defaultSportsOption
            : finalObject.selectedLevel,
        selectedAge:
          finalObject.age_preference.length > 0 ? JSON.parse(formattedAge) : [],
        selected:
          finalObject.match_time.length == 0
            ? defaultselected
            : finalObject.match_time,
        selectedPlayerLimit: finalObject.player_limit
          ? finalObject.player_limit
          : "",

        selectedDistance: finalObject.distance ? finalObject.distance : "",
        selectedCost: finalObject.cost ? finalObject.cost : "",
        location: finalObject.location ? finalObject.location : "",
        crrntLong: finalObject.longitude ? finalObject.longitude : "",
        crrntLat: finalObject.latitude ? finalObject.latitude : "",
      });
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

  setSportsTitle = (sports) => {
    this.setState({ sportsTitle: sports });
  };

  onDayPress = (day) => {
    if (this.state.isStartDatePicked == false) {
      let markedDates = {};
      markedDates[day.dateString] = {
        startingDay: true,
        color: Colors.PRIMARY,
        textColor: Colors.WHITE,
      };
      this.setState({
        markedDates: markedDates,
        isStartDatePicked: true,
        isEndDatePicked: false,
        startDate: day.dateString,
      });
    } else {
      let markedDates = this.state.markedDates;
      let startDate = moment(this.state.startDate);
      let endDate = moment(day.dateString);
      let range = endDate.diff(startDate, "days");
      if (range > 0) {
        for (let i = 1; i <= range; i++) {
          let tempDate = startDate.add(1, "day");
          tempDate = moment(tempDate).format("YYYY-MM-DD");
          if (i < range) {
            markedDates[tempDate] = {
              color: Colors.PRIMARY,
              textColor: Colors.WHITE,
            };
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: Colors.PRIMARY,
              textColor: Colors.WHITE,
            };
          }
        }
        this.setState({
          markedDates: markedDates,
          isStartDatePicked: false,
          isEndDatePicked: true,
          startDate: "",
        });
      } else {
      }
    }
  };

  // Callbacks
  onLayout = (event) => {
    this.setState({
      calculatewidth: event.nativeEvent.layout.width - SliderPad * 2,
    });
  };

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

  onSelectDistanceDropDown = (selectedItem) => {
    this.setState({ selectedDistance: selectedItem }, () => {});
  };

  onSelectGameDropDown = (selectedItem) => {
    this.setState({ selectedGame: selectedItem });
  };

  onSelectPlayerLimitDropDown = (selectedItem) => {
    this.setState({ selectedPlayerLimit: selectedItem }, () => {});
  };

  onSelectCostDropDown = (selectedItem) => {
    this.setState({ selectedCost: selectedItem }, () => {});
  };

  onSelectedGenderItemsChange = (selectedRooms) => {
    this.setState({ selectedGender: selectedRooms });
  };

  onSelectedGenderRoomChange = (selectedRooms) => {
    this.setState({ selectedGender: selectedRooms });
  };

  formatForMultiSelectGender(arr) {
    var temp = [];
    arr.filter((item) => {
      temp.push(item.id);
    });
    return temp;
  }

  onCkeckedSportsLevel = (item, index) => {
    const { sportsOptionsData } = this.state;
    sportsOptionsData.map((lvl, lvlIndex) => {
      if (index == lvlIndex) {
        lvl.isChecked = !lvl.isChecked;
      }
    });

    this.setState({ sportsOptionsData }, () => {
      var selectedItem = sportsOptionsData.filter((item) => {
        return item.isChecked;
      });

      if (selectedItem.length == 0) {
        this.setState({
          selectedLevel: [],
        });
      } else {
        this.setState({
          selectedLevel: selectedItem,
        });
      }
      this.forceUpdate();
    });
  };

  onLongCkeckedSportsLevel = (item, index) => {
    const { sportsOptionsData } = this.state;
    sportsOptionsData.map((lvl, lvlIndex) => {
      if (lvlIndex == index) {
        lvl.isChecked = false;
      }
    });
    this.setState({ sportsOptionsData }, () => {
      var selectedItem = sportsOptionsData.filter((item) => {
        return item.isChecked;
      });
      this.setState({
        selectedLevel: selectedItem,
      });
      this.forceUpdate();
    });
  };

  renderSportsOptionsview = (item, index) => {
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
            borderWidth: item.isChecked ? 2 : 0,
            borderColor: item.isChecked ? Colors.PRIMARY : Colors.WHISPER,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            TabStyle.sportstitleview,
            {
              fontFamily: item.isChecked
                ? font_type.FontExtraBold
                : font_type.FontRegular,
              color: item.isChecked ? Colors.BLACK : Colors.GREY,
              textAlign: "center",
            },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  doClickFindMatchtoNavigate = async () => {
    const {
      selectedCost,
      selectedPlayerLimit,
      selectedDistance,
      selectedAge,
      selected,
      selectedLevel,
      selectedGender,
      selectedSport,
      markedDates,
      crrntLat,
      crrntLong,
      location,
      selectedFilters,
      isFilterEnable,
      sportsOptionsData,
      convertedendTime,
      convertedstartTime,
    } = this.state;
    const selectsportsID = [];
    
    if (globals.isInternetConnected == true) {
      if (location.trim() === "") {
        showErrorMessage(errors.selectLocation);
        return;
      }

      if (JSON.stringify(selected) == JSON.stringify([min, max])) {
      } else {
        if (convertedstartTime == convertedendTime) {
          showErrorMessage(errors.selectvalidtime);
          return;
        }
      }

      selectedLevel.filter((item, index) => {
        selectsportsID.push(item.title);
      });

      Keyboard.dismiss();
      const params = {
        match_dates: Object.keys(markedDates),
        match_time: selected,
        sport: JSON.stringify(selectedSport),
        level: selectsportsID,
        selectedLevel: sportsOptionsData,
        player_limit: selectedPlayerLimit,
        gender: JSON.stringify(selectedGender),
        age_preference: JSON.stringify(selectedAge),
        distance: selectedDistance.replace(/[^0-9]/g, ""),
        cost: selectedCost,
        latitude: crrntLat,
        longitude: crrntLong,
        location: location,
        start_time: convertedstartTime,
        end_time: convertedendTime,
        is_filter: selectedFilters != 0 ? 1 : isFilterEnable,
      };
      this.props.doFindMatch(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  onSelectedAvailibilityItemsChange = (selectedRooms) => {
    this.setState(
      { selectedSport: selectedRooms, isSelectedSports: true },
      () => {
        if (this.state.isSelectedSports == true) {
          this.setState({
            isSelectedSports: false,
          });
        }
      }
    );
  };

  onSelectedAgeItemsChange = (selectedRooms) => {
    this.setState({ selectedAge: selectedRooms });
  };

  onSelectedRoomChange = (selectedRooms) => {
    this.setState({ selectedSport: selectedRooms });
  };

  onSelectedAgeRoomChange = (selectedRooms) => {
    this.setState({ selectedAge: selectedRooms });
  };

  formatForMultiSelectAge(arr) {
    var temp = [];
    arr.filter((item) => {
      temp.push(item.id);
    });
    return temp;
  }

  formatForMultiSelect(arr) {
    var temp = [];
    arr.filter((item) => {
      temp.push(item.id);
    });
    return temp;
  }

  onNavigateToProfile = () => {
    this.displayProfilePicker();
    this.props.props.navigation.navigate("EditProfile", { isFrom: "" });
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

  onChangeTexttoRemove = (text) => {
    this.setState({ location: text });
  };

  render() {
    const {
      selected,
      calculatewidth,
      markedDates,
      sportsTitle,
      sportsOptionsData,
      selectedLevel,
      selectedSport,
      selectedDistance,
      selectedCost,
      selectedPlayerLimit,
      selectedGender,
      selectedAge,
      location,
    } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <View style={[TabStyle.calendarContainer]}>
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
            placeholder={location}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{ flex: 1 }}
        >
          <View
            style={[
              TabStyle.dropdownmargins,
              {
                marginBottom: hp(3),
              },
            ]}
          >
            <Calendar
              minDate={Date()}
              monthFormat={"MMMM yyyy"}
              markedDates={markedDates}
              markingType="period"
              hideExtraDays={true}
              // hideDayNames={true}
              enableSwipeMonths={true}
              onDayPress={this.onDayPress}
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
              Options={sportsTitle}
              Icon={Icon}
              onSelectedAvailibilityItemsChange={
                this.onSelectedAvailibilityItemsChange
              }
              onSelectedRoomChange={this.onSelectedRoomChange}
              selectedItems={this.formatForMultiSelect(selectedSport)}
              selectText="Sports"
              subKey="children"
            />
          </View>

          <View style={[TabStyle.LevelHorizontalView]}>
            <Text
              style={[
                TabStyle.chooseFontStyle,
                { width: "39%", marginLeft: wp(2) },
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
              bounces={false}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            />
          </View>

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
                return selectedPlayerLimit
                  ? "Number of Players: " + selectedItem
                  : "Number of Players";
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
              selectedItems={this.formatForMultiSelectGender(selectedGender)}
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
              onSelectedAvailibilityItemsChange={this.onSelectedAgeItemsChange}
              onSelectedRoomChange={this.onSelectedAgeRoomChange}
              selectedItems={this.formatForMultiSelectAge(selectedAge)}
              selectText="Age Range"
              subKey="children"
            />
          </View>

          <View style={TabStyle.dropdownmargins}>
            <CustomDropDownPicker
              onSelect={(selectedItem) =>
                this.onSelectDistanceDropDown(selectedItem)
              }
              defaultButtonText={"Distance"}
              defaultButtonText={
                selectedDistance ? "Distance: " + selectedDistance : "Distance"
              }
              data={["5mi", "10mi", "20mi", "30mi", "50mi", "100mi", "200mi"]}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedDistance
                  ? "Distance: " + selectedItem
                  : "Distance";
              }}
            />
          </View>
          {1 == 2 ? (
            <View style={TabStyle.dropdownmargins}>
              <CustomDropDownPicker
                onSelect={(selectedItem) =>
                  this.onSelectCostDropDown(selectedItem)
                }
                defaultButtonText={
                  selectedCost ? "Cost: " + selectedCost : "Cost"
                }
                data={["Free", "Paid"]}
                buttonTextAfterSelection={(selectedItem) => {
                  return selectedCost ? "Cost: " + selectedItem : "Cost";
                }}
              />
            </View>
          ) : null}

          <View
            style={[
              AuthStyle.loginView,
              { marginTop: hp(1.5), marginBottom: hp(5) },
            ]}
          >
            <TouchableOpacity onPress={() => this.doClickFindMatchtoNavigate()}>
              <BackgroundButton
                title={strings.findMatch}
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
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyFindMatch: state.app.isBusyFindMatch,
    responseFindMatchdata: state.app.responseFindMatchdata,
    isBusyGetTitleAndCategory: state.app.isBusyGetTitleAndCategory,
    responseGetTitleAndCategorydata: state.app.responseGetTitleAndCategorydata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    currentUser: state.auth.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doGetSportsTitleAndCateGory,
        doFindMatch,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FindMatchFilterScreen);
