import { Dimensions,PixelRatio, StatusBar, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

// Find the deviceWidth & deviceHeight
export let deviceWidth = Dimensions.get("window").width;
export let deviceHeight = Dimensions.get("window").height;

// Check the device iPad or not
let iPad = DeviceInfo.getModel();
export const timeoutDuration = 30000;
export const appName = "MatchPlayHub";
export const isInternetConnected = true;
export const isDarkMode = "";
export const isRegistrationDeatils=false;
export let isTablat = iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet();
export const warning = "Warning!";
export const noInternet ="This Application Require Network Connection!";
export const onlyoneDevice ="This Application works on one device only please try again with login"


const scale = deviceWidth / 320;
export function normalize(size) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

// ADD theme modes
export const THEME_MODE = {
  DARK: "dark",
  LIGHT: "light",
};



// Check the return custom condition
export function renderIf(condition, component) {
  if (condition) {
    return component;
  } else {
    return null;
  }
}

export const iPhoneX =
  Platform.OS === "ios" &&
  Dimensions.get("window").height === 812 &&
  Dimensions.get("window").width === 375;

// --------------------------------- FontSizes For Whole App -------------------------------------

// More big new
export const font_8 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 9
    : Platform.OS === "ios"
    ? deviceWidth * 0.025
    : deviceWidth * 0.0225; // 8
export const font_9 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 10
    : Platform.OS === "ios"
    ? deviceWidth * 0.0275
    : deviceWidth * 0.025; // 9
export const font_10 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 12
    : Platform.OS === "ios"
    ? deviceWidth * 0.03
    : deviceWidth * 0.0275; // 10
export const font_11 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 14
    : Platform.OS === "ios"
    ? deviceWidth * 0.0325
    : deviceWidth * 0.03; // 11
export const font_12 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 16
    : deviceWidth * 0.032; // 12
export const font_13 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 20
    : deviceWidth * 0.0346; // 13
export const font_14 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 23
    : Platform.OS === "ios"
    ? deviceWidth * 0.04
    : deviceWidth * 0.0375; // 14
// export const font_14 = Platform.OS === 'ios' ? screenHeight * 0.02 : screenHeight * 0.0172; // 14
export const font_15 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 25
    : Platform.OS === "ios"
    ? deviceWidth * 0.0435
    : deviceWidth * 0.04; // 14
export const font_16 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 27
    : Platform.OS === "ios"
    ? deviceWidth * 0.0475
    : deviceWidth * 0.0425; // 16
// export const font_16 = Platform.OS === 'ios' ? screenHeight * 0.02 : screenHeight * 0.02; // 16
export const font_17 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 29
    : Platform.OS === "ios"
    ? deviceWidth * 0.05
    : deviceWidth * 0.045; // 17
export const font_18 =
  iPad.indexOf("iPad") != -1 || DeviceInfo.isTablet()
    ? 31
    : Platform.OS === "ios"
    ? deviceWidth * 0.048
    : deviceWidth * 0.0475; // 18
export const font_19 = deviceWidth * 0.0475; // 19
export const font_20 = deviceWidth * 0.053; // 20
export const font_22 = deviceWidth * 0.055; // 22
export const font_24 = deviceWidth * 0.064; // 24
export const font_26 = deviceWidth * 0.0693; // 26
export const font_28 = deviceWidth * 0.07; // 28
export const font_29 = deviceWidth * 0.075; // 28
export const font_32 = deviceWidth * 0.08; // 32
export const font_36 = deviceWidth * 0.09; // 36
export const font_40 = deviceWidth * 0.106; // 40
export const font_53 = 53; // 53

// SAVE ASYNCH VALUES

export var access_token = "";
