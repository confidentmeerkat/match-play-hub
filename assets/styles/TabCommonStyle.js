import { StyleSheet, Platform } from "react-native";
import Colors from "../../app/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import font_type from "../../app/resources/fonts";

export const TabCommonStyle = StyleSheet.create({
  container: { backgroundColor: Colors.WHITE, flex: 1 },

  txtHeader: {
    fontSize: RFPercentage(3),
    fontFamily: font_type.FontBold,
    color: Colors.WHITE,
    marginVertical: hp(2),
    marginStart: wp(3),
  },
  txtNoReminder: {
    fontSize: RFPercentage(3),
    fontFamily: font_type.FontRegular,
    color: Colors.colorText,
    textAlign: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex:1,
    backgroundColor: Colors.WHITE,
  },
  viewList: { marginStart: hp(1), marginEnd: hp(1), flex: 1, marginTop: hp(5) },
  listContentStyleWithData: { flexGrow: 1, justifyContent: "flex-start" },
  listContentStyleWithoutData: { flexGrow: 1, justifyContent: "center" },
  viewAdd: { alignSelf: "flex-end", position: "absolute", bottom: 10, end: 10 },
  tabIcon: {
    width: wp(6),
    height: wp(6),
    marginStart: hp(3),
    marginVertical: hp(2),
    tintColor: Colors.WHITE,
  },

  ///SETTING TAB STYLE
  whiteBg: {
    backgroundColor: Colors.WHITE,
    marginVertical: hp(1),
    marginHorizontal: wp(2),
  },
  smalltextStyle: {
    fontSize: RFPercentage(2.2),
    fontFamily: font_type.FontRegular,
  },
  bigTextStyle: {
    fontSize: RFPercentage(2.6),
    fontFamily: font_type.FontRegular,
    fontWeight: "500",
    color: Colors.BACKGROUND,
  },
});
