import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  View,
  Platform,
  StyleSheet,
  Alert,
  Text,
  PermissionsAndroid,
} from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Geolocation from "react-native-geolocation-service";
import AndroidOpenSettings from "react-native-android-open-settings";
import RNSettings from "react-native-settings";
import Colors from "../../../../constants/Colors";
import * as globals from "../../../../utils/Globals";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import strings from "../../../../resources/languages/strings";
import { EventRegister } from "react-native-event-listeners";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../../../resources/constants";

let LATITUDE = 37.0902;
let LONGITUDE = 95.7129;
let ASPECT_RATIO = globals.deviceWidth / globals.deviceHeight;
let LATITUDE_DELTA = 0.05; //0.0922;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 1;
class MapViewMatchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      isProfilePicker: false,
      filteredmatchData: props.filteredmatchData,
      locationInfo: props.locationInfo,
      selectedFilters: 0,
      selectedCallbackFiltersData: {},
      location: "Enter Location",
      crrntLong: 0,
      crrntLat: 0,
      isFilterEnable: props.isFilterEnable,
      region: {
        latitude:37.3318456,
        longitude: -122.0296002,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      destination: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      photoUrl: "",
      forceRefresh: 0,
      count: true,
      distance: "",
      markers: {
        coordinate: {
          latitude: 4,
          longitude: 4,
        },
        key: id,
        color: Colors.PRIMARY,
      },
    };
  }

  async componentDidMount() {
    await this.getApiToken();

    if (this.props.currentUser !== undefined) {
      this.setCurrentUser();
    }
    // if (Platform.OS === "android") {
    //   this.requestLocationServices();
    // } else {
    //   this.gotToMyLocation();
    // }
    this.listenerone = EventRegister.addEventListener(
      "updateMatches",
      ({ matchData, locationInfo }) => {
        this.setState({
          locationInfo: locationInfo,
          filteredmatchData: matchData,
          forceRefresh: Math.floor(Math.random() * 100),
        });
      }
    );
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listenerone);
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

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
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

  setUserInfo = () => {
    const { currentUser } = this.state;
    this.setState({
      photoUrl: currentUser.profile_url,
    });
  };

  onMapPress(e) {
    this.setState({
      markers: {
        coordinate: e.nativeEvent.coordinate,
        key: id++,
      },
    });

    SaveAddress = () => {
      console.log(JSON.stringify(this.state.markers[0].coordinate.latitude));
    };
  }

  async requestLocationServices() {
    if (this.state.count) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]).then((result) => {
        if (result["android.permission.ACCESS_FINE_LOCATION"] === "granted") {
          setTimeout(() => this.gotToMyLocation(), 3000);
        } else {
        }
      });
    }
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

          this.setState({
            region: focusedLocation,
            forceRefresh: Math.floor(Math.random() * 100),
          });
        },
        (err) => {
          RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result) => {
            if (result == RNSettings.ENABLED) {
              if (err.code === 1 && this.state.count) {
                Alert.alert(strings.permissionTitle, strings.PermissionDesc, [
                  {
                    text: "Setting",
                    onPress: () => {
                      AndroidOpenSettings.appDetailsSettings();
                      this.setState({ count: false });
                    },
                  },
                ]);
              }
            } else {
              if (this.state.count) {
                Alert.alert(strings.permissionTitle, strings.PermissionDesc, [
                  {
                    text: "Setting",
                    onPress: () => {
                      AndroidOpenSettings.locationSourceSettings();
                      this.setState({ count: false });
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

          this.setState({
            region: focusedLocation,
            forceRefresh: Math.floor(Math.random() * 100),
          });
        },
        (err) => {
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

  mapMarkers = () => {
    return this.state.filteredmatchData.map((report) => (
      <Marker
        key={report.id}
        coordinate={{
          latitude: Number(report.latitude),
          longitude: Number(report.longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        title={report.sport}
      ></Marker>
    ));
  };

  render() {
    const { region, photoUrl, destination, filteredmatchData, isFilterEnable } =
      this.state;

    return (
      <View style={[TabCommonStyle.container]}>
        {isFilterEnable == 0 && filteredmatchData.length == 0 ? (
          <>
            <View style={TabStyle.emptyview}>
              <Text numberOfLines={2} style={TabStyle.emptytext}>
                {strings.noUpcomingMatches}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={{ marginHorizontal: wp(5), marginVertical: hp(2) }}>
              <MapView
                style={[styles.map]}
                ref={(ref) => {
                  this.mapRef = ref;
                }}
                style={{
                  height: globals.deviceHeight * 0.5,
                }}
                key={this.state.forceRefresh}
                provider={PROVIDER_GOOGLE}
                onPress={(e) => this.onMapPress(e)}
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                followsUserLocation={true}
                pitchEnabled={true}
                showsCompass={true}
                showsBuildings={true}
                showsIndoors={true}
                zoomEnabled={true}
                zoomControlEnabled={true}
              >
                {/* <Marker coordinate={region}>
                  <FastImage
                    source={
                      photoUrl === ""
                        ? images.dummy_user_img
                        : { uri: photoUrl }
                    }
                    style={[TabStyle.smallimgStyle]}
                  />
                </Marker> */}
                {this.mapMarkers()}
                {/* <MapViewDirections
                  destination={destination}
                  loadingEnabled={true}
                  apikey={API_GOOGLE_MAP_KEY}
                  strokeWidth={5}
                  strokeColor={Colors.PRIMARY}
                  onStart={(params) => {}}
                  onReady={(result) => {
                    if (result.distance != 0)
                      this.mapRef.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: globals.deviceWidth / 10,
                          bottom: globals.deviceHeight / 10,
                          left: globals.deviceWidth / 10,
                          top: globals.deviceHeight / 10,
                        },
                      });
                    this.setState({
                      distance: result.distance,
                    });
                  }}
                /> */}
              </MapView>
            </View>
          </>
        )}
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
export default connect(mapStateToProps, mapDispatchToProps)(MapViewMatchScreen);
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
