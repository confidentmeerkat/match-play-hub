import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  ScrollView,
  FlatList,
  Text,
  View,
  Platform,
} from "react-native";
import Header from "../../../components/Header/Header";
import strings from "../../../resources/languages/strings";
import BackgroundButton from "../../../components/buttons/BackgroundButton";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import font_type from "../../../resources/fonts";
import { doGetSportsTitleAndCateGory } from "../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../redux/actions/AuthActions";
import { showSuccessMessage, showErrorMessage } from "../../../utils/helpers";
import CustomDropDownPicker from "../../../components/Dropdowns/CustomDropDownPicker";
import errors from "../../../resources/languages/errors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../resources/constants";
import * as globals from "../../../utils/Globals";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../../constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import { EventRegister } from "react-native-event-listeners";
import MultiSelectDropDown from "../../../components/Dropdowns/MultiSelectDropDown";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthStyle } from "../../../../assets/styles/AuthStyle";
import { AgeMultipleOptions } from "../../../constants/AgeMultipleOptions";

class SearchFiltersScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      selectedDistance: "",
      SportsOptionsData: [
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
      getSportsTitle: [],
      selectedSport: [],
      selectedGender: "",
      selectedLevel: "",
      selectedAge: [],
      searchCount: 0,
      finalObject: props.route.params.finalObject,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
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
    if (this.props.currentUser !== undefined) {
      this.setCurrentUser();
    }
    await this.getApiToken();
    this.getSportsTitles();
    this.setfinalObjects();
  }

  componentWillUnmount() {}

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
    });
  };

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

  setSportsTitle = (sports) => {
    this.setState({ getSportsTitle: sports });
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

  setfinalObjects = () => {
    const { finalObject, currentUser } = this.state;
    let formattedSports;
    let formattedAge;
    if (finalObject.sports.length > 0) {
      var data = JSON.parse(finalObject.sports);
      var b = JSON.stringify(data);
      formattedSports = b.replace(/\\/g, "");
    }
    if (finalObject.age.length == 0) {
      var data = JSON.parse(currentUser.age_preference);
      var b = JSON.stringify(data);
      formattedAge = b.replace(/\\/g, "");
    } else {
      var data = JSON.parse(finalObject.age);
      var b = JSON.stringify(data);
      formattedAge = b.replace(/\\/g, "");
    }
    this.setState({
      selectedGender: finalObject.gender
        ? finalObject.gender
        : currentUser.gender,
      selectedLevel: finalObject.skill_level ? finalObject.skill_level : "",
      selectedAge: JSON.parse(formattedAge),
      selectedDistance: finalObject.location_radius
        ? finalObject.location_radius
        : currentUser.distance,
      selectedSport: finalObject.sports
        ? JSON.parse(formattedSports)
        : currentUser.assignSportCategory,
    });
  };

  onSelectGenderDropDown = (selectedItem) => {
    this.setState({ selectedGender: selectedItem }, () => {
      if (this.state.selectedGender) {
        this.setState({ searchCount: this.state.searchCount + 1 });
      }
      this.forceUpdate();
    });
  };

  onSelectDistanceDropDown = (selectedItem) => {
    this.setState({ selectedDistance: selectedItem }, () => {
      if (this.state.selectedDistance) {
        this.setState({ searchCount: this.state.searchCount + 1 });
      }
      this.forceUpdate();
    });
  };

  onCkeckedSportsLevel = (item, index) => {
    const { SportsOptionsData, selectedLevel } = this.state;
    SportsOptionsData.map((lvl, lvlIndex) => {
      if (lvlIndex == index) {
        this.setState({ selectedLevel: lvl.title });
        this.forceUpdate();
        lvl.isChecked = true;
      } else {
        lvl.isChecked = false;
      }
    });
    this.setState({ SportsOptionsData }, () => {
      if (this.state.selectedLevel.trim() === "") {
      } else {
        this.setState({ searchCount: this.state.searchCount + 1 });
      }
    });
  };
  onLongCkeckedSportsLevel = (item, index) => {
    const { SportsOptionsData } = this.state;
    SportsOptionsData.map((lvl, lvlIndex) => {
      if (lvlIndex == index) {
        this.setState({ selectedLevel: "" });
        lvl.isChecked = false;
      }
    });
    this.setState({ SportsOptionsData }, () => {
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

  doClickContinuetoNavigate = async () => {
    const {
      selectedDistance,
      selectedAge,
      selectedLevel,
      selectedGender,
      selectedSport,
      searchCount,
    } = this.state;

    if (globals.isInternetConnected == true) {
      let finalReturendObject = {
        Distance: selectedDistance.replace(/[^0-9]/g, ""),
        Age: JSON.stringify(selectedAge),
        Sport: JSON.stringify(selectedSport),
        Level: selectedLevel,
        Gender: selectedGender,
        TotalNumberofSearch: searchCount,
      };
      const { navigation } = this.props;
      navigation.goBack();
      EventRegister.emit("addFilters", { finalReturendObject });
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  doClickcontinue = () => {
    if (this.state.selectedSport.length == 0) {
      this.doClickContinuetoNavigate();
    } else {
      this.setState({ searchCount: this.state.searchCount + 1 }, () => {
        this.doClickContinuetoNavigate();
      });
    }
  };

  onSelectedSportsItemsChange = (selectedRooms) => {
    this.setState({ selectedSport: selectedRooms });
  };

  onSelectedAgeItemsChange = (selectedRooms) => {
    this.setState({ selectedAge: selectedRooms }, () => {
      if (this.state.selectedAge) {
        this.setState({ searchCount: this.state.searchCount + 1 });
      }
    });
  };

  onSelectedSportsRoomChange = (selectedRooms) => {
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

  render() {
    const {
      selectedSport,
      searchCount,
      selectedAge,
      selectedGender,
      selectedDistance,
      getSportsTitle,
      SportsOptionsData,
      selectedLevel,
    } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={[TabStyle.dropdownmargins]}></View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{ flex: 1 }}
        >
          <View style={[TabStyle.LevelHorizontalView]}>
            <Text
              style={[
                TabStyle.chooseFontStyle,
                { width: "35%", marginLeft: wp(2) },
              ]}
            >
              {selectedLevel
                ? "Level" + " : " + (selectedLevel ? selectedLevel : "")
                : "Level"}
            </Text>

            <FlatList
              style={[TabStyle.onlyFlex]}
              data={SportsOptionsData}
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
                this.onSelectDistanceDropDown(selectedItem)
              }
              defaultButtonText={
                selectedDistance ? "Distance: " + selectedDistance : "Distance"
              }
              data={["5mi", "10mi", "20mi", "30mi", "50mi", "100mi", "200mi"]}
              buttonTextAfterSelection={(selectedItem) => {
                return "Distance: " + selectedItem;
              }}
            />
          </View>
          <View style={TabStyle.dropdownmargins}>
            <CustomDropDownPicker
              onSelect={(selectedItem) =>
                this.onSelectGenderDropDown(selectedItem)
              }
              defaultButtonText={
                selectedGender ? "Gender: " + selectedGender : "Gender"
              }
              data={[" ", "Female", "Male", "Anyone"]}
              buttonTextAfterSelection={(selectedItem) => {
                return "Gender: " + selectedItem;
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
              Options={AgeMultipleOptions}
              Icon={Icon}
              onSelectedAvailibilityItemsChange={this.onSelectedAgeItemsChange}
              onSelectedRoomChange={this.onSelectedAgeRoomChange}
              selectedItems={this.formatForMultiSelectAge(selectedAge)}
              selectText="Age Preference"
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
              Options={getSportsTitle}
              Icon={Icon}
              onSelectedAvailibilityItemsChange={
                this.onSelectedSportsItemsChange
              }
              onSelectedRoomChange={this.onSelectedSportsRoomChange}
              selectedItems={this.formatForMultiSelect(selectedSport)}
              selectText="Sports"
              subKey="children"
            />
          </View>

          <View style={AuthStyle.loginView}>
            <TouchableOpacity onPress={() => this.doClickcontinue()}>
              <BackgroundButton
                title={strings.continue}
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
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFiltersScreen);
