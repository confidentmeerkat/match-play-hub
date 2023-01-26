import { connect } from "react-redux";
import React, { PureComponent } from "react";
import {
  View,
  Platform,
  StyleSheet,
  Linking,
  Alert,
  Text,
  PermissionsAndroid,
} from "react-native";
import Header from "../../../../components/Header/Header";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
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

let LATITUDE = 21.640575;
let LONGITUDE = 69.605965;
let ASPECT_RATIO = globals.deviceWidth / globals.deviceHeight;
let LATITUDE_DELTA = 0.05; //0.0922;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 1;
class MapViewScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchDetail: props.route.params.matchDetail,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      origin: {
        latitude: 0,
        longitude: 0,
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

  componentDidMount() {
    const { matchDetail } = this.state;
    const focusedLocationdata = {
      latitude: Number(matchDetail.latitude),
      longitude: Number(matchDetail.longitude),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    this.setState({ destination: focusedLocationdata }, () => {
      if (this.props.currentUser !== undefined) {
        this.setState({ currentUser: this.props.currentUser }, () => {
          this.setUserInfo();
        });
      }
    });
    if (Platform.OS === "android") {
      this.requestLocationServices();
    } else {
      this.gotToMyLocation();
    }
  }

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

  async gotToMyLocation() {
    if (Platform.OS === "android") {
      Geolocation.getCurrentPosition(
        async (pos) => {
          const focusedLocation = {
            latitude: Number(pos.coords.latitude),
            longitude: Number(pos.coords.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };

          await this.setState({
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

  goToInitialLocation() {
    let region = Object.assign({}, this.state.destination);
    region["latitudeDelta"] = 0.005;
    region["longitudeDelta"] = 0.005;
    this.mapRef.animateToRegion(region, 2000);
  }

  render() {
    const { region, matchDetail, photoUrl, origin, destination } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={{ marginBottom: hp(3) }}>
          <MapView
            style={[styles.map]}
            ref={(ref) => {
              this.mapRef = ref;
            }}
            style={{
              height: globals.deviceHeight * 0.55,
            }}
            key={this.state.forceRefresh}
            provider={PROVIDER_GOOGLE}
            onPress={(e) => this.onMapPress(e)}
            initialRegion={destination}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            pitchEnabled={true}
            showsCompass={true}
            showsBuildings={true}
            showsIndoors={true}
            zoomEnabled={true}
            zoomControlEnabled={true}
            onMapReady={() => this.goToInitialLocation()}
          >
            {/* <Marker coordinate={region}>
              <FastImage
                source={
                  photoUrl === "" ? images.dummy_user_img : { uri: photoUrl }
                }
                style={[TabStyle.smallimgStyle]}
              />
            </Marker> */}

            <Marker coordinate={destination}>
              <View style={TabStyle.mapwidthView}>
                <Text style={TabStyle.smallheadertext}>
                  {matchDetail.sport ? matchDetail.sport : ""}
                </Text>

                <Text style={TabStyle.smallheadertext}>
                  {matchDetail.location ? matchDetail.location : ""}
                </Text>
              </View>
            </Marker>
            {/* <MapViewDirections
              origin={origin}
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
        <View style={[TabStyle.dropdownmargins]}>
          <Text style={TabStyle.smallheadertext}>
            {"Match: "} {matchDetail.sport ? matchDetail.sport : ""}
          </Text>

          <Text style={TabStyle.smallheadertext}>
            {"Location: "}
            {matchDetail.location ? matchDetail.location : ""}
          </Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(MapViewScreen);
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
