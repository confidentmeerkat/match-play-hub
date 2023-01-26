import { Dimensions } from "react-native";

const guidelineBaseWidth = 500;
const guidelineBaseHeight = 680;
const scale = (size) =>
  (Dimensions.get("window").width / guidelineBaseWidth) * size;
export const moderateScale = (size, factor = 0.65) =>
  size + (scale(size) - size) * factor;
export const moderatePixel = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
// SCALE PIXELS BASED ON SCREEN SIZE

// END TO SETUP FONT-TYPE AND FONT-SIZE

export const prefEnum = {
  TAG_API_TOKEN: "apiToken",
  TAG_USER: "user",
  TAG_FCM_TOKEN: "fcmToken",
};

export const constantsData = {
  HELP_CENTER_URL: "",
  SUPPORT_EMAIL: "",
};
export function tabletWidthCorrect(width) {
  if (width > 500) {
    let differenceRatio = 500 / width;
    width = width * differenceRatio * 1.1;
  }
  return width;
}

export const howOften = {
  ONE_TIME: 1,
  ONCE_PER_DAY: 2,
  EVERY_OTHER_DAY: 3,
  EVERY_WEEK: 4,
};
export const howLong = {
  NO_END_DATE: 5,
  END_DATE: 6,
};
