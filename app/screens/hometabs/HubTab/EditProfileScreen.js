import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  View,
  Keyboard,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  BackHandler,
  PermissionsAndroid,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DefaultOptions } from "../../../constants/DefaultOptions";
import * as ImagePicker from "react-native-image-picker";
import images from "../../../resources/images";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import HeadingWithText from "../../../components/RenderFlatlistComponent/HeadingWithText";
import LabelWithText from "../../../components/buttons/LabelWithText";
import strings from "../../../resources/languages/strings";
import FastImage from "react-native-fast-image";
import * as globals from "../../../utils/Globals";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthStyle } from "../../../../assets/styles/AuthStyle";
import Colors from "../../../constants/Colors";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../resources/constants";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MediaModel from "../../../components/modals/MediaModel";
import {
  doUpdateProfile,
  doGetSports,
  doGetUserLocation,
} from "../../../redux/actions/AppActions";
import { doRefreshToken, doGetUser } from "../../../redux/actions/AuthActions";
import {
  showSuccessMessage,
  isName,
  showErrorMessage,
  isUsername,
} from "../../../utils/helpers";
import Loader from "../../../components/loaders/Loader";
import BackgroundButton from "../../../components/buttons/BackgroundButton";
import font_type from "../../../resources/fonts";
import errors from "../../../resources/languages/errors";
import MultiSelectDropDown from "../../../components/Dropdowns/MultiSelectDropDown";
import { AvailabilityOptions } from "../../../constants/AvailabilityOptions";
import Geolocation from "react-native-geolocation-service";
import RNSettings from "react-native-settings";
import CustomDropDownPicker from "../../../components/Dropdowns/CustomDropDownPicker";
import Header from "../../../components/Header/Header";
import { EventRegister } from "react-native-event-listeners";
import { AgeMultipleOptions } from "../../../constants/AgeMultipleOptions";
import { MatchPreference } from "../../../constants/MatchPreference";
import CustomSlots from "../../../components/buttons/CustomSlots";

let LATITUDE = 37.3318456;
let LONGITUDE = -122.0296002;
let ASPECT_RATIO = globals.deviceWidth / globals.deviceHeight;
let LATITUDE_DELTA = 0.05; //0.0922;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class EditProfileScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFrom: props.route.params.isFrom,
      selectedAvailibilityItems: [],
      selectedMatchPreferenceItems: [],
      geometry: [],
      address_components: [],
      CrrntLong: "",
      CrrntLat: "",
      region: {
        latitude: "",
        longitude: "",
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      options: DefaultOptions,
      isGalleryPicker: false,
      photoUrl: "",
      photoObj: [],
      username: "",
      location: "",
      gender: "",
      genderPreference: "",
      dob: "",
      zipcode: "",
      currentCountry: "",
      currentState: "",
      currentCity: "",
      distance: "",
      old_profile: "",
      count: true,
      aboutyou: "",
      atleastonecheked: false,
      age_preference: [],
      selectedGender: "",
      errUsername: "",
      errZipcode: "",
      isDatePickerVisible: false,
      forceRefresh: 0,
      currentLocation: {},
      currentUser: {},
      sportCategory: [],
      selectedSports: [],
      isFocused: false,
      isFocusedZipcode: false,
      isFocusedAboutYou: false,
      isUsemylocation: false,
      isallowPermission: false,
      isGoBack: false,
    };
  }

  /**
   * This function perform when redux action value updates
   * @prevProps is old props which compare this new props
   */
  componentDidUpdate(prevProps) {
    if (prevProps.responseGetSportsdata !== this.props.responseGetSportsdata) {
      if (this.props.responseGetSportsdata !== undefined) {
        const {
          success,
          message,
          sportCategory,
          status_code,
          atleastonecheked,
        } = this.props.responseGetSportsdata;
        if (status_code == 200 && success == true) {
          this.setSportsData(sportCategory, atleastonecheked);
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
      prevProps.responseBusyGetUserLocationdata !==
      this.props.responseBusyGetUserLocationdata
    ) {
      if (this.props.responseBusyGetUserLocationdata !== undefined) {
        const { success, message, address, latLong, status_code } =
          this.props.responseBusyGetUserLocationdata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.setAddressdata(address, latLong);
        } else if (success == false) {
          showErrorMessage(message);
          this.setState({ zipcode: "", isUsemylocation: false });
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (status_code !== undefined && status_code === 402) {
            //showErrorMessage(message);
            this.clearUserData();
            this.props.navigation.navigate("AuthLoading");
          } else if (status_code == 500) {
            //showErrorMessage(strings.somethingWrong);
          } else {
            //showErrorMessage(message);
          }
        }
      }
    }

    if (
      prevProps.responseUpdateProfiledata !==
      this.props.responseUpdateProfiledata
    ) {
      if (this.props.responseUpdateProfiledata !== undefined) {
        const { error, success, message, status_code } =
          this.props.responseUpdateProfiledata;
        if (status_code == 200 && success == true) {
          showSuccessMessage(message);
          this.props.doGetUser();
        } else if (success == false) {
          if (status_code == 401 && message == "Token has expired") {
            this.props.doRefreshToken();
          } else if (error.username) {
            showErrorMessage(error.username);
          } else if (error.zip_code) {
            showErrorMessage(error.zip_code);
          } else if (error.assignSport) {
            showErrorMessage(error.assignSport);
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

    if (prevProps.responseUserdata !== this.props.responseUserdata) {
      if (this.props.responseUserdata !== undefined) {
        const { user, success, message, status_code } =
          this.props.responseUserdata;
        if (status_code == 200 && success == true) {
          AsyncStorage.setItem(prefEnum.TAG_USER, JSON.stringify(user));

          if (this.state.isFrom == "FindPlayer") {
            EventRegister.emit("initializeApp");
            EventRegister.emit("refreshPlayersList");
            this.props.navigation.goBack();
          } else {
            EventRegister.emit("initializeApp");
            this.props.navigation.goBack();
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
  }

  async componentDidMount() {
    await this.getApiToken();
    // if (Platform.OS === "android") {
    //   await this.requestLocationServices();
    // }
    // else {
    //   await this.gotToMyLocation();
    // }
    if (this.props.currentUser !== undefined) {
      this.setState(
        {
          currentUser: this.props.currentUser,
          selectedSports: this.props.userSportCategory,
        },
        () => {
          this.setUserInfo();
        }
      );
    }
    this.getSports();
    if (Platform.OS == "android") {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (this.state.isGoBack == true) {
            this.askbeforeLeave();
            return true;
          }
        }
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS == "android") {
      this.backHandler.remove();
    }
  }

  askbeforeLeave = () => {
    Alert.alert(globals.appName, strings.gobackwithoutsave, [
      {
        text: "OK",
        onPress: async () => {
          await this.clearStates();
        },
      },
      {
        text: "Cancel",
        onPress: () => {},
      },
    ]);
  };

  clearStates = () => {
    this.setState(
      {
        selectedAvailibilityItems: [],
        geometry: [],
        address_components: [],
        CrrntLong: "",
        CrrntLat: "",
        region: {
          latitude: "",
          longitude: "",
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        options: DefaultOptions,
        isGalleryPicker: false,
        photoUrl: "",
        photoObj: [],
        username: "",
        location: "",
        gender: "",
        genderPreference: "",
        dob: "",
        zipcode: "",
        currentCountry: "",
        currentState: "",
        currentCity: "",
        distance: "",
        old_profile: "",
        count: true,
        aboutyou: "",
        atleastonecheked: false,
        age_preference: [],
        selectedGender: "",
        errUsername: "",
        errZipcode: "",
        isDatePickerVisible: false,
        forceRefresh: 0,
        currentLocation: {},
        currentUser: {},
        sportCategory: [],
        selectedSports: [],
        isFocused: false,
        isFocusedZipcode: false,
        isFocusedAboutYou: false,
        isUsemylocation: false,
        isallowPermission: false,
      },
      () => {
        this.props.navigation.goBack();
      }
    );
  };

  setSportsData = (sportCategory, atleastonecheked) => {
    this.setState({
      sportCategory: sportCategory,
      atleastonecheked: atleastonecheked,
    });
  };

  setAddressdata = (address, latLong) => {
    if (address) {
      this.setState(
        {
          isUsemylocation: false,
          zipcode: address.postal_code,
          currentCountry: address.country,
          currentState: address.administrative_area_level_1,
          currentCity: address.administrative_area_level_2,
          CrrntLong: latLong ? latLong.lng : 0,
          CrrntLat: latLong ? latLong.lat : 0,
        },
        () => {
          this.updateprofileAPI();
        }
      );
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

  getSports = async () => {
    if (globals.isInternetConnected == true) {
      this.props.doGetSports();
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  async requestLocationServices() {
    if (this.state.count) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]).then((result) => {
        if (result["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
          // setTimeout(() => this.gotToMyLocation(), 3000);
          this.setState({ isallowPermission: true });
        } else {
          showErrorMessage(errors.requiredLocation);
        }
      });
    }
  }

  setAddressComponents(results) {
    const finalAddressData = results[0].address_components;
    let currentCountryCode;
    finalAddressData.map((item, Index) => {
      if (item.types == "postal_code") {
        currentCountryCode = item.long_name;
      } else {
      }
    });
    this.setState({
      address_components: results[0].address_components,
      geometry: results.geometry,
      zipcode: currentCountryCode,
    });
  }

  gotToMyLocation() {
    if (Platform.OS === "android") {
      Geolocation.getCurrentPosition(
        (pos) => {
          const focusedLocation = {
            latitude: Number(pos.coords.latitude),
            longitude: Number(pos.coords.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };

          this.setState(
            {
              region: focusedLocation,
              CrrntLong: Number(pos.coords.longitude),
              CrrntLat: Number(pos.coords.latitude),
              forceRefresh: Math.floor(Math.random() * 100),
            },
            () => {
              this.getUsemyLocationAPI();
            }
          );
        },
        (err) => {
          this.setState({ isUsemylocation: false });
          // RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result) => {
          //   if (result == RNSettings.ENABLED) {
          //     if (err.code === 1 && this.state.count) {
          //       Alert.alert(strings.permissionTitle, strings.PermissiononlyDesc, [
          //         {
          //           text: "Setting",
          //           onPress: () => {
          //             AndroidOpenSettings.appDetailsSettings();
          //             this.setState({ count: false });
          //           },
          //         },
          //       ]);
          //     }
          //   } else {
          //     if (this.state.count) {
          //       Alert.alert(strings.permissionTitle, strings.PermissiononlyDesc, [
          //         {
          //           text: "Setting",
          //           onPress: () => {
          //             AndroidOpenSettings.locationSourceSettings();
          //             this.setState({ count: false });
          //           },
          //         },
          //       ]);
          //     }
          //   }
          // });
        },
        {
          enableHighAccuracy: true,
          forceRequestLocation: true,
          showLocationDialog: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else if (Platform.OS === "ios") {
      Geolocation.getCurrentPosition(
        (pos) => {
          const focusedLocation = {
            latitude: Number(pos.coords.latitude),
            longitude: Number(pos.coords.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };

          this.setState(
            {
              region: focusedLocation,
              CrrntLong: Number(pos.coords.longitude),
              CrrntLat: Number(pos.coords.latitude),
              forceRefresh: Math.floor(Math.random() * 100),
            },
            () => {
              this.getUsemyLocationAPI();
            }
          );
        },
        (err) => {
          this.setState({ isUsemylocation: false });
          RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result) => {
            if (result === RNSettings.ENABLED) {
              if (err.code === 1 && this.state.count) {
                Alert.alert(strings.permissionTitle, strings.PermissionIOS, [
                  {
                    text: "OK",
                  },
                ]);
              }
            } else {
              if (this.state.count) {
                Alert.alert(strings.permissionTitle, strings.PermissionDesc, [
                  {
                    text: "Setting",
                    onPress: () => {
                      Linking.openURL("App-prefs:root=LOCATION_SERVICES");
                    },
                  },
                ]);
              }
            }
          });
        },
        {
          enableHighAccuracy: true,
          forceRequestLocation: true,
          showLocationDialog: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    }
  }

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  setUserInfo = () => {
    const { currentUser } = this.state;
    let finaltAvilibility;
    if (currentUser.availability) {
      var data = JSON.parse(currentUser.availability);
      var b = JSON.stringify(data);
      finaltAvilibility = b.replace(/\\/g, "");
    }
    let formattedAge;
    if (currentUser.age_preference) {
      var data = JSON.parse(currentUser.age_preference);
      var b = JSON.stringify(data);
      formattedAge = b.replace(/\\/g, "");
    }
    let formattedMatchPreference;
    if (currentUser.match_structure) {
      var data = JSON.parse(currentUser.match_structure);
      var b = JSON.stringify(data);
      formattedMatchPreference = b.replace(/\\/g, "");
    }
    this.setState({
      username: currentUser.username,
      gender: currentUser.gender,
      zipcode: currentUser.zip_code,
      aboutyou: currentUser.about_us,
      distance: currentUser.distance,
      dob: currentUser.birthdate,
      photoUrl: currentUser.profile_url,
      old_profile: currentUser.profile,
      genderPreference: currentUser.gender_preference,
      age_preference: currentUser.age_preference
        ? JSON.parse(formattedAge)
        : [],
      selectedMatchPreferenceItems: currentUser.match_structure
        ? JSON.parse(formattedMatchPreference)
        : [],
      selectedAvailibilityItems: currentUser.availability
        ? JSON.parse(finaltAvilibility)
        : [],
      CrrntLong: currentUser.longitude ? currentUser.longitude : "",
      CrrntLat: currentUser.latitude ? currentUser.latitude : "",
      currentCity: currentUser.city ? currentUser.city : "",
      currentCountry: currentUser.country_name ? currentUser.country_name : "",
      currentState: currentUser.state ? currentUser.state : "",
    });
  };

  doClickContactUs = () => {
    this.props.navigation.navigate("HelpCenter");
  };

  doClickUpdateProfile = async () => {
    await this.getManallyEnterlocation();
  };

  updateprofileAPI = async () => {
    const {
      username,
      gender,
      dob,
      distance,
      photoObj,
      old_profile,
      aboutyou,
      zipcode,
      selectedAvailibilityItems,
      selectedMatchPreferenceItems,
      genderPreference,
      age_preference,
      CrrntLong,
      CrrntLat,
      selectedSports,
      currentCity,
      currentCountry,
      currentState,
      atleastonecheked,
    } = this.state;
    if (globals.isInternetConnected == true) {
      const finalselectedSports = [
        ...new Map(selectedSports.map((o) => [o.sports_id, o])).values(),
      ];

      if (username.trim() === "") {
        this.setState({ errUsername: errors.enter_username }, () => {
          this.usernameRef.focus();
        });
        showErrorMessage(errors.enter_username);
        return;
      }
      if (!isName(username)) {
        this.setState({ errUsername: errors.emailvalidLength }, () => {
          this.usernameRef.focus();
        });
        showErrorMessage(errors.emailvalidLength);
        return;
      }
      if (!isUsername(username)) {
        this.setState({ errUsername: errors.emailvalidLength }, () => {
          this.usernameRef.focus();
        });
        showErrorMessage(errors.validusername);
        return;
      }
      if (dob.trim() === "") {
        showErrorMessage(errors.choose_dob);
        return;
      }
      if (zipcode.trim() === "") {
        this.setState({ errZipcode: errors.enter_zipcode }, () => {
          this.zipcodeRef.focus();
        });
        showErrorMessage(errors.enter_zipcode);
        return;
      }
      if (selectedSports.length < 3) {
        showErrorMessage(strings.atleastthreeSports);
        return;
      }

      Keyboard.dismiss();
      const photoobject = {
        name: photoObj.name,
        type: photoObj.type,
        uri: photoObj.uri,
      };

      const params = {
        gender: gender,
        birthdate: dob,
        zip_code: zipcode,
        distance: distance.replace(/[^0-9]/g, ""),
        about_us: aboutyou,
        username: username,
        old_profile: old_profile,
        gender_preference: genderPreference,
        age_preference: JSON.stringify(age_preference),
        match_structure: JSON.stringify(selectedMatchPreferenceItems),
        availability: JSON.stringify(selectedAvailibilityItems),
        profile:
          photoObj.uri == undefined || (photoObj.uri == "") != []
            ? " "
            : photoobject,
        latitude: CrrntLat,
        longitude: CrrntLong,
        city: currentCity,
        country_name: currentCountry,
        state: currentState,
        assignSport: JSON.stringify(finalselectedSports),
      };
      this.props.doUpdateProfile(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  // show Date Picker
  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  // hide Date Picker
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  // set Date choose from, picker
  handleConfirm = (date) => {
    this.setState({
      isDatePickerVisible: false,
      dob: moment(date).format("MM-DD-YYYY"),
      isGoBack: true,
    });
  };

  //display gallry picker model
  displayGalleryPicker = () => {
    this.setState({ isGalleryPicker: !this.state.isGalleryPicker });
  };

  // Render modal faltlist view to choose camera or gallery
  renderOptionsview = (item, index) => {
    return (
      <>
        <TouchableOpacity
          key={index}
          onPress={() => this.onselectOptions(item)}
        >
          <View style={ProfileStyle.viewPopupStyle}>
            <FastImage
              style={[ProfileStyle.imagePopupStyle]}
              tintColor={Colors.PRIMARY}
              source={item.image}
            ></FastImage>

            <Text style={[ProfileStyle.textStylePopup]}>{item.title}</Text>
          </View>
        </TouchableOpacity>
        {index < 1 ? <View style={ProfileStyle.lineStyle1}></View> : null}
      </>
    );
  };

  // select camera or gallery option
  onselectOptions = (item) => {
    if (item.title == strings.captureimgfromCamera) {
      this.captureImage();
    } else if (item.title == strings.uploadfromgallery) {
      this.chooseMedia();
    }
  };

  // capture img from camera
  captureImage = async () => {
    if (Platform.OS == "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "MatchPlayHub Camera Permission",
            message:
              "MatchPlayHub App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log("You can use the camera");
        } else {
          console.log("Camera permission denied");

          this.setState({
            isGalleryPicker: false,
            photoUrl: this.state.currentUser.profile_url,
            isGoBack: true,
          });
          return;
        }
      } catch (err) {}
    }

    ImagePicker.launchCamera(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel === true) {
        } else {
          const source = {
            uri: response.uri,
            name: response.fileName ? response.fileName : "Dummy.jpg",
            size: response.fileSize,
            type: response.type,
          };
          this.setState({
            isGalleryPicker: false,
            photoUrl: response.uri,
            photoObj: source,
            isGoBack: true,
          });
        }
      }
    );
  };

  // choose profile photo from gallery
  chooseMedia = async () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if (response.didCancel === true) {
        } else {
          const source = {
            uri: response.uri,
            name: response.fileName ? response.fileName : "Dummy.jpg",
            size: response.fileSize,
            type: response.type,
          };
          this.setState({
            isGalleryPicker: false,
            photoUrl: response.uri,
            photoObj: source,
            isGoBack: true,
          });
        }
      }
    );
  };

  onSelectedRoomChange = (selectedRooms) => {
    this.setState({ selectedAvailibilityItems: selectedRooms, isGoBack: true });
  };
  onSelectedMatchPreRoomChange = (selectedRooms) => {
    this.setState({
      selectedMatchPreferenceItems: selectedRooms,
      isGoBack: true,
    });
  };
  onSelectedAvailibilityItemsChange = (selectedRooms) => {
    this.setState({ selectedAvailibilityItems: selectedRooms, isGoBack: true });
  };
  onSelectedMatchPreChange = (selectedRooms) => {
    this.setState({
      selectedMatchPreferenceItems: selectedRooms,
      isGoBack: true,
    });
  };

  formatForMultiSelect(arr) {
    var temp = [];
    arr.filter((item) => {
      temp.push(item.id);
    });
    return temp;
  }

  getManallyEnterlocation = async () => {
    const { CrrntLong, selectedSports, username, dob, zipcode, CrrntLat } =
      this.state;
    // this.handleBlurZipcode();
    if (username.trim() === "") {
      this.setState({ errUsername: errors.enter_username }, () => {
        this.usernameRef.focus();
      });
      showErrorMessage(errors.enter_username);
      return;
    }
    if (!isName(username)) {
      this.setState({ errUsername: errors.emailvalidLength }, () => {
        this.usernameRef.focus();
      });
      showErrorMessage(errors.emailvalidLength);
      return;
    }

    if (!isUsername(username)) {
      this.setState({ errUsername: errors.emailvalidLength }, () => {
        this.usernameRef.focus();
      });
      showErrorMessage(errors.validusername);
      return;
    }
    if (dob.trim() === "") {
      showErrorMessage(errors.choose_dob);
      return;
    }
    if (zipcode.trim() === "") {
      this.setState({ errZipcode: errors.enter_zipcode }, () => {
        this.zipcodeRef.focus();
      });
      showErrorMessage(errors.enter_zipcode);
      return;
    } else {
      this.setState({ isUsemylocation: true }, async () => {
        if (zipcode.trim() === "") {
          showErrorMessage("Please enter valid zipcode.");
          this.setState({ isUsemylocation: false });
          return;
        }
        if (globals.isInternetConnected == true) {
          let params = {
            latitude: "",
            longitude: "",
            zip_code: zipcode,
            status: "zip_code",
          };
          this.props.doGetUserLocation(params);
        } else {
          showErrorMessage(errors.no_internet);
        }
      });
    }
  };

  getUsemyLocationAPI = async () => {
    const { CrrntLong, CrrntLat, zipcode } = this.state;

    this.handleBlurZipcode();

    if (globals.isInternetConnected == true) {
      let params = {
        latitude: CrrntLat,
        longitude: CrrntLong,
        zip_code: "",
        status: "location",
      };
      this.props.doGetUserLocation(params);
    } else {
      showErrorMessage(errors.no_internet);
    }
  };

  getCurrentLocation = async (status) => {
    const { CrrntLong, CrrntLat, zipcode } = this.state;
    if (status == "Location") {
      if (this.state.isallowPermission == false && Platform.OS == "android") {
        await this.requestLocationServices();
      } else {
        this.setState({ zipcode: "", isUsemylocation: true }, async () => {
          this.gotToMyLocation();
        });
      }
    } else {
      this.getManallyEnterlocation();
    }
  };

  onSelectGenderDropDown = (selectedItem) => {
    this.setState({ gender: selectedItem, isGoBack: true });
  };

  onSelectGenderPrefrerenceDropDown = (selectedItem) => {
    this.setState({ genderPreference: selectedItem, isGoBack: true });
  };

  onSelectDistanceDropDown = (selectedItem) => {
    this.setState({ distance: selectedItem, isGoBack: true });
  };

  onSelectedAgeItemsChange = (selectedRooms) => {
    this.setState({ age_preference: selectedRooms, isGoBack: true });
  };

  onSelectedAgeRoomChange = (selectedRooms) => {
    this.setState({ age_preference: selectedRooms, isGoBack: true });
  };
  formatForMultiSelectAge(arr) {
    var temp = [];
    arr.filter((item) => {
      temp.push(item.id);
    });
    return temp;
  }

  onCkeckedSportsLevel = (item, row, index) => {
    let tempSports;
    const { sportCategory, selectedSports } = this.state;

    let sportData = JSON.parse(JSON.stringify(sportCategory));
    for (let i = 0; i < sportData.length; i++) {
      let data = sportData[i];

      if (data.title == item.title) {
        data.sports.map((d) => {
          if (d.id == row.id && d.title == row.title) {
            d.sub_checkbox.map((lvl, lvlIndex) => {
              if (lvlIndex == index) {
                lvl.isChecked = true;
                tempSports = {
                  sports_category_id: item.id,
                  sports_id: row.id,
                  status: lvl.title,
                };
                return (lvl.isChecked = true ? tempSports : "");
              } else {
                lvl.isChecked = false;
              }
            });
          }
        });
      }
    }

    this.setState({
      selectedSports: [...this.state.selectedSports, tempSports],
      sportCategory: sportData,
      atleastonecheked: true,
      isGoBack: true,
    });
  };

  deSelectSports = (item, row, index) => {
    const { sportCategory } = this.state;
    let tempSports;
    let tempsportsarray = [];

    let sportData = JSON.parse(JSON.stringify(sportCategory));
    for (let i = 0; i < sportData.length; i++) {
      let data = sportData[i];
      if (data.title == item.title) {
        data.sports.map((d) => {
          if (d.id == row.id && d.title == row.title) {
            d.sub_checkbox.map((lvl, lvlIndex) => {
              if (lvlIndex == index) {
                lvl.isChecked = false;
                tempSports = {
                  sports_category_id: item.id,
                  sports_id: row.id,
                  status: lvl.title,
                };
                return tempsportsarray.push(tempSports);
              }
            });
          }
        });
      }
    }
    let finalSportsarr = [].concat(
      this.state.selectedSports.filter((obj1) =>
        tempsportsarray.every((obj2) => obj1.sports_id !== obj2.sports_id)
      ),
      tempsportsarray.filter((obj2) =>
        this.state.selectedSports.every(
          (obj1) => obj2.sports_id !== obj1.sports_id
        )
      )
    );

    this.setState({
      sportCategory: sportData,
      selectedSports: finalSportsarr,
      tempSports,
      atleastonecheked: true,
      isGoBack: true,
    });
  };

  onLongCkeckedSportsLevel = (item, row, index, subrow) => {
    if (subrow.isChecked && subrow.isChecked) {
      Alert.alert(
        strings.dialog_title_confirm_deselect,
        strings.dialog_message_confirm_deselect,
        [
          {
            text: strings.btn_cancel,
            onPress: () => console.log("Cancel Pressed"),
          },
          {
            text: strings.btn_deselect,
            onPress: () => {
              this.deSelectSports(item, row, index);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  renderSportCategoryview = (item, outerindex) => {
    let items = [];

    if (item.sports) {
      items = item.sports.map((row, innerindex) => {
        let subitems = [];
        if (row.sub_checkbox) {
          subitems = row.sub_checkbox.map((subrow, index) => {
            return (
              <TouchableOpacity
                key={index}
                delayLongPress={800}
                onLongPress={() =>
                  this.onLongCkeckedSportsLevel(item, row, index, subrow)
                }
                onPress={() => this.onCkeckedSportsLevel(item, row, index)}
                style={[
                  ProfileStyle.roundedview,
                  {
                    borderWidth: subrow.isChecked ? 2 : 0,
                    borderColor: subrow.isChecked
                      ? Colors.PRIMARY
                      : Colors.WHISPER,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    ProfileStyle.sportstitleview,
                    {
                      fontFamily: subrow.isChecked
                        ? font_type.FontExtraBold
                        : font_type.FontRegular,
                      color: subrow.isChecked
                        ? Colors.BLACK
                        : Colors.LITE_BLACK,
                      textAlign: "center",
                    },
                  ]}
                >
                  {subrow.title}
                </Text>
              </TouchableOpacity>
            );
          });
        }
        return (
          <View
            key={innerindex}
            style={[
              ProfileStyle.sportstitleviewbefore,
              { marginHorizontal: wp(2) },
            ]}
          >
            <Text numberOfLines={1} style={[ProfileStyle.sportstitleview]}>
              {row.title}
            </Text>
            {subitems}
          </View>
        );
      });
    }

    return (
      <>
        <View
          key={outerindex}
          style={[ProfileStyle.headerTitleView, { marginHorizontal: wp(2) }]}
        >
          <FastImage
            style={[ProfileStyle.calendarimg, { marginRight: wp(2) }]}
            source={
              item.sport_url === ""
                ? images.global_img
                : { uri: item.sport_url }
            }
          ></FastImage>
          <Text numberOfLines={1} style={[ProfileStyle.headertext]}>
            {item.title}
          </Text>
        </View>
        {items}
      </>
    );
  };

  renderListHeaderComponent = () => {
    const {
      username,
      dob,
      genderPreference,
      zipcode,
      gender,
      distance,
      age_preference,
      aboutyou,
      errUsername,
      errZipcode,
      photoUrl,
      isGalleryPicker,
      isFocusedAboutYou,
      options,
      currentUser,
      isFocused,
      isFocusedZipcode,
      isDatePickerVisible,
      selectedMatchPreferenceItems,
      selectedAvailibilityItems,
    } = this.state;
    return (
      <>
        <View>
          <MediaModel
            modalVisible={isGalleryPicker}
            onBackdropPress={() => this.displayGalleryPicker()}
          >
            <View style={ProfileStyle.modelContainer}>
              <View style={[ProfileStyle.modelView]}>
                <View style={ProfileStyle.titleviewstyle}>
                  <Text style={[ProfileStyle.choosefilestyle]}>
                    {strings.filetoupload}
                  </Text>
                  <View style={ProfileStyle.lineStyle}></View>
                  <View
                    style={{
                      height: globals.deviceWidth * 0.28,
                    }}
                  >
                    <FlatList
                      style={[ProfileStyle.onlyFlex]}
                      data={options}
                      renderItem={({ item, index }) =>
                        this.renderOptionsview(item, index)
                      }
                      bounces={false}
                      showsVerticalScrollIndicator={false}
                      listKey={(item, index) => "D" + index.toString()}
                      keyExtractor={(item, index) => "D" + index.toString()}
                    />
                  </View>
                </View>
              </View>
            </View>
          </MediaModel>
        </View>

        <HeadingWithText
          titleText={strings.myprofile}
          marginVerticalview={hp(1.5)}
          marginLeftview={wp(3)}
        />

        <View style={ProfileStyle.upadte_conatiner}>
          <View style={ProfileStyle.image_conatiner}>
            <TouchableOpacity onPress={() => this.displayGalleryPicker()}>
              <FastImage
                style={ProfileStyle.imageStyle}
                source={
                  photoUrl === "" || photoUrl == undefined
                    ? images.profile_img
                    : { uri: photoUrl }
                }
              ></FastImage>
            </TouchableOpacity>
            <CustomSlots titleText={strings.uploadpicture} />
          </View>

          <KeyboardAwareScrollView
            style={[
              AuthStyle.scrollViewStyle,
              { marginHorizontal: 0, marginVertical: 1 },
            ]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={AuthStyle.scrollContentStyle}
          >
            <LabelWithText
              titleText={strings.username}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
              required={true}
            />
            <View
              style={[
                AuthStyle.usernameView,
                errUsername !== ""
                  ? AuthStyle.errorStyle
                  : AuthStyle.noErrorStyle,
                {
                  borderColor: isFocused ? Colors.PRIMARY : Colors.LITE_GREY,
                  borderWidth: 1,
                  marginTop: 0,
                  marginBottom: 10,
                },
              ]}
            >
              <TextInput
                value={username}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                ref={(ref) => (this.usernameRef = ref)}
                style={[AuthStyle.textInputStyle, { paddingHorizontal: 7 }]}
                blurOnSubmit={false}
                autoCapitalize={"none"}
                onChangeText={(text) => {
                  this.setState({
                    username: text,
                    isGoBack: currentUser.username == username ? false : true,
                    errUsername:
                      text.trim() === "" ? errors.enter_username : "",
                  });
                }}
                placeholderTextColor={Colors.BLACK}
                returnKeyType="next"
                placeholder=""
                onSubmitEditing={() => {
                  this.zipcodeRef.focus();
                }}
              />
            </View>

            <LabelWithText
              titleText={strings.gender}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
            />
            <View
              style={[
                AuthStyle.usernameView,
                { marginTop: 0, marginBottom: 10 },
              ]}
            >
              <CustomDropDownPicker
                onSelect={(selectedItem) =>
                  this.onSelectGenderDropDown(selectedItem)
                }
                defaultButtonText={gender ? gender : "Select"}
                data={["", "Female", "Male", "Anyone"]}
                buttonTextAfterSelection={(selectedItem) => {
                  return selectedItem;
                }}
              />
            </View>

            <LabelWithText
              titleText={strings.dob}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
              required={true}
            />
            <View
              style={[
                AuthStyle.usernameView,
                AuthStyle.noErrorStyle,
                { paddingVertical: 5, marginTop: 0, marginBottom: 10 },
              ]}
            >
              <View style={[AuthStyle.calendarTextinputStyle]}>
                <Text
                  numberOfLines={1}
                  style={[
                    AuthStyle.dateTextStyle,
                    { color: Colors.BLACK, marginHorizontal: -2 },
                  ]}
                >
                  {dob ? dob : strings.dob}
                </Text>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={"date"}
                date={
                  dob != "" ? moment(dob, "MM-DD-YYYY").toDate() : new Date()
                }
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
                maximumDate={new Date()}
                display="spinner"
              />
              <View style={[AuthStyle.hideShowView, { end: 10 }]}>
                <TouchableOpacity
                  style={[
                    AuthStyle.calendarTextinputStyle,
                    { marginRight: -10 },
                  ]}
                  onPress={() => this.showDatePicker()}
                >
                  <FastImage
                    resizeMode="contain"
                    style={[ProfileStyle.calendarimg]}
                    source={images.calendar_img}
                    tintColor={Colors.PRIMARY}
                  ></FastImage>
                </TouchableOpacity>
              </View>
            </View>

            <LabelWithText
              titleText={strings.aboutu}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
            />
            <View
              style={[
                AuthStyle.aboutview,
                {
                  borderColor: isFocusedAboutYou
                    ? Colors.PRIMARY
                    : Colors.LITE_GREY,
                  marginTop: 0,
                  marginBottom: 10,
                },
              ]}
            >
              <TextInput
                onFocus={this.handleFocusAboutYou}
                onBlur={this.handleBlurAboutYou}
                value={aboutyou}
                ref={(ref) => (this.aboutyouRef = ref)}
                style={[
                  AuthStyle.textInputStyle,
                  {
                    width: "100%",
                    paddingLeft: 6,
                    height: 80,
                  },
                ]}
                textAlignVertical="top"
                blurOnSubmit={false}
                maxLength={100}
                multiline={true}
                numberOfLines={3}
                autoCapitalize={"none"}
                onChangeText={(text) => {
                  this.setState({
                    aboutyou: text,
                    isGoBack: true,
                  });
                }}
                placeholderTextColor={Colors.BLACK}
                returnKeyType="next"
                placeholder=""
                onSubmitEditing={() => {
                  this.aboutyouRef.blur();
                }}
              />
            </View>

            <LabelWithText
              titleText={strings.zipcode}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
              required={true}
            />
            <View
              style={[
                AuthStyle.usernameView,
                errZipcode !== ""
                  ? AuthStyle.errorStyle
                  : AuthStyle.noErrorStyle,
                {
                  borderColor: isFocusedZipcode
                    ? Colors.PRIMARY
                    : Colors.LITE_GREY,
                  borderWidth: 1,
                  marginTop: 0,
                  marginBottom: 10,
                },
              ]}
            >
              <TextInput
                onFocus={this.handleFocusZipcode}
                onBlur={this.handleBlurZipcode}
                value={zipcode}
                ref={(ref) => (this.zipcodeRef = ref)}
                style={[
                  AuthStyle.textInputStyle,
                  {
                    paddingHorizontal: 7,
                    width: "95%",
                  },
                ]}
                blurOnSubmit={false}
                autoCapitalize={"none"}
                onChangeText={(text) => {
                  this.setState({
                    zipcode: text,
                    isGoBack: true,
                  });
                }}
                placeholderTextColor={Colors.BLACK}
                returnKeyType="done"
                placeholder=""
                onSubmitEditing={() => {
                  this.zipcodeRef.blur();
                }}
                maxLength={11}
                keyboardType="phone-pad"
                // onBlur={() => this.getManallyEnterlocation()}
              />
              {/* <View style={[AuthStyle.hideShowView, { end: 10 }]}>
                <TouchableOpacity
                  //  onPress={this.detectlocation.bind(this)}
                  onPress={() => this.getCurrentLocation("Location")}
                  style={{ flexDirection: "row" }}
                >
                  <Text style={ProfileStyle.locationtext}>
                    {strings.usemyLocation}
                  </Text>
                  <FastImage
                    resizeMode="contain"
                    tintColor={Colors.PRIMARY}
                    style={ProfileStyle.calendarimg}
                    source={images.fill_location_img}
                  ></FastImage>
                </TouchableOpacity>
              </View> */}
            </View>

            <LabelWithText
              titleText={strings.travelDistance}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
            />
            <View
              style={[
                AuthStyle.usernameView,
                { marginTop: 0, marginBottom: 10 },
              ]}
            >
              <CustomDropDownPicker
                onSelect={(selectedItem) =>
                  this.onSelectDistanceDropDown(selectedItem)
                }
                defaultButtonText={distance ? distance + "mi" : "Select"}
                data={["5mi", "10mi", "20mi", "30mi", "50mi", "100mi", "200mi"]}
                buttonTextAfterSelection={(selectedItem) => {
                  return selectedItem;
                }}
              />
            </View>

            <LabelWithText
              titleText={strings.genderPreference}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
            />
            <View
              style={[
                AuthStyle.usernameView,
                { marginTop: 0, marginBottom: 10 },
              ]}
            >
              <CustomDropDownPicker
                onSelect={(selectedItem) =>
                  this.onSelectGenderPrefrerenceDropDown(selectedItem)
                }
                defaultButtonText={
                  genderPreference ? genderPreference : "Select"
                }
                data={["", "Female", "Male", "Anyone"]}
                buttonTextAfterSelection={(selectedItem) => {
                  return selectedItem;
                }}
              />
            </View>

            <LabelWithText
              titleText={strings.matchPreference}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
            />
            <View
              style={[
                AuthStyle.multiselectView,
                { marginTop: hp(0), marginBottom: 10 },
              ]}
            >
              <MultiSelectDropDown
                Options={MatchPreference}
                Icon={Icon}
                onSelectedAvailibilityItemsChange={
                  this.onSelectedMatchPreChange
                }
                onSelectedRoomChange={this.onSelectedMatchPreRoomChange}
                selectedItems={this.formatForMultiSelect(
                  selectedMatchPreferenceItems
                )}
                selectText="Select"
                subKey="children"
              />
            </View>

            <LabelWithText
              titleText={strings.availibility}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
            />
            <View
              style={[
                AuthStyle.multiselectView,
                { marginTop: hp(0), marginBottom: 10 },
              ]}
            >
              <MultiSelectDropDown
                Options={AvailabilityOptions}
                Icon={Icon}
                onSelectedAvailibilityItemsChange={
                  this.onSelectedAvailibilityItemsChange
                }
                onSelectedRoomChange={this.onSelectedRoomChange}
                selectedItems={this.formatForMultiSelect(
                  selectedAvailibilityItems
                )}
                selectText="Select"
                subKey="children"
              />
            </View>

            <LabelWithText
              titleText={strings.agePreference}
              marginVerticalview={hp(1)}
              marginLeftview={wp(2.5)}
            />
            <View
              style={[
                AuthStyle.multiselectView,
                { marginTop: hp(0), marginBottom: 10 },
              ]}
            >
              <MultiSelectDropDown
                Options={AgeMultipleOptions}
                Icon={Icon}
                onSelectedAvailibilityItemsChange={
                  this.onSelectedAgeItemsChange
                }
                onSelectedRoomChange={this.onSelectedAgeRoomChange}
                selectedItems={this.formatForMultiSelectAge(age_preference)}
                selectText="Select"
                subKey="children"
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
        <HeadingWithText
          titleText={strings.selectSports}
          marginVerticalview={hp(1.5)}
          marginLeftview={wp(0)}
        />
        <Text style={ProfileStyle.spoprtsheadertext}>
          {strings.sportsLevel}
        </Text>
      </>
    );
  };
  renderListFooter = () => {
    return (
      <View style={[ProfileStyle.helpcentertext, { marginTop: hp(2) }]}>
        <Text style={[AuthStyle.alreadyAccounttxt]}>{strings.dontseepost}</Text>

        <TouchableOpacity onPress={() => this.doClickContactUs()}>
          <Text style={[AuthStyle.alreadyAccounttxtLink]}>
            {strings.contactus}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderListFooterComponent = () => {
    return (
      <View
        style={[AuthStyle.loginView, { marginTop: hp(1), marginBottom: hp(1) }]}
      >
        <TouchableOpacity onPress={() => this.doClickUpdateProfile()}>
          <BackgroundButton
            title={strings.saveprofile}
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
    );
  };
  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => this.setState({ isFocused: false });

  handleFocusZipcode = () => this.setState({ isFocusedZipcode: true });

  handleBlurZipcode = () => this.setState({ isFocusedZipcode: false });

  handleFocusAboutYou = () => this.setState({ isFocusedAboutYou: true });

  handleBlurAboutYou = () => this.setState({ isFocusedAboutYou: false });

  render() {
    const { sportCategory, isFrom, isGoBack } = this.state;
    return (
      <View style={[ProfileStyle.container]}>
        <Header
          isHideBack
          props={this.props}
          clearStates={() => this.clearStates()}
          isFrom={isFrom ? isFrom : "EditProfile"}
          isGoBack={isGoBack}
        />
        <View
          style={[
            ProfileStyle.sportsview,
            { marginTop: -hp(1), marginBottom: hp(0.5) },
          ]}
        >
          <FlatList
            style={{ flex: 1 }}
            data={sportCategory}
            extraData={sportCategory}
            renderItem={({ item, index }) =>
              this.renderSportCategoryview(item, index)
            }
            bounces={false}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={this.renderListFooter()}
            ListHeaderComponent={this.renderListHeaderComponent()}
            listKey={(item, index) => "D" + index.toString()}
            keyExtractor={(item, index) => "D" + index.toString()}
          ></FlatList>
          {this.renderListFooterComponent()}
        </View>
        {this.props.isBusyGetSports ||
        this.props.isBusyUpdateProfile ||
        this.state.isUsemylocation ? (
          <Loader />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyGetUserLocation: state.app.isBusyGetUserLocation,
    responseBusyGetUserLocationdata: state.app.responseBusyGetUserLocationdata,
    isBusyGetSports: state.app.isBusyGetSports,
    responseGetSportsdata: state.app.responseGetSportsdata,
    responseUserdata: state.auth.responseUserdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    isBusyUpdateProfile: state.app.isBusyUpdateProfile,
    responseUpdateProfiledata: state.app.responseUpdateProfiledata,
    currentUser: state.auth.currentUser,
    userSportCategory: state.auth.userSportCategory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doUpdateProfile,
        doGetUser,
        doGetSports,
        doGetUserLocation,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
