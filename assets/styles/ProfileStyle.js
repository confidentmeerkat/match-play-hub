import { StyleSheet, Platform } from "react-native";
import Colors from "../../app/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import font_type from "../../app/resources/fonts";
import * as globals from "../../app/utils/Globals";

export const ProfileStyle = StyleSheet.create({
  container: { backgroundColor: Colors.WHITE, flex: 1 },
  innercontainer: {
    marginHorizontal: wp(6),
    marginTop: hp(3),
  },
  headerTitleView: {
    flexDirection: "row",
    marginVertical: hp(1),
  },
  beforetabview: {
    marginHorizontal: 20,
    marginBottom: 14,
  },
  imageStyle: {
    height: globals.deviceWidth * 0.27,
    width: globals.deviceWidth * 0.27,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderRadius: (globals.deviceWidth * 0.27) / 2,
  },
  chatimgs: {
    height: globals.deviceWidth * 0.22,
    width: globals.deviceWidth * 0.22,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderRadius: (globals.deviceWidth * 0.22) / 2,
  },

  locationicon: {
    height: hp(1.8),
    width: hp(1.8),
    // marginRight: 5,
  },
  calendarimg: {
    height: hp(3),
    width: hp(3),
  },
  locationtext: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontSemiBold,
    color: Colors.PRIMARY,
    textAlign: "center",
    alignSelf: "center",
  },
  profilecontainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
    justifyContent: "space-between",
  },
  middle_view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  start_view: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: hp(2),
    marginLeft: wp(7),
  },
  last_endview: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginVertical: hp(2),
    marginRight: wp(7),
  },
  settingsiconstyle: {
    width: wp(11),
    height: wp(11),
  },
  qrcodestyle: {
    width: wp(10),
    height: wp(10),
  },
  middlecontainer: {
    // marginTop: hp(1),
    alignItems: "center",
    justifyContent: "center",
  },
  subview: {
    marginVertical: hp(1.5),
  },
  headertext: {
    fontSize: RFPercentage(2.5),
    fontFamily: font_type.FontBold,
    color: Colors.BLACK,
    marginBottom: 1,
  },
  subtitleview: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
  },
  smalltextview: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
  },
  lineViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.GREY,
    marginTop: globals.deviceHeight * 0.02,
    height: 0.4,
    marginBottom: globals.deviceHeight * 0.02,
  },
  scrollViewStyle: { flex: 1, marginHorizontal: wp(5), marginVertical: 20 },
  scrollContentStyle: { flexGrow: 1 },

  /// UPDATE PROFILE SCREEN

  upadte_conatiner: {
    flex: 1,
    marginBottom: hp(2),
    marginBottom: hp(1),
  },
  image_conatiner: {
    // flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  statics_dropdownContainer: {
    marginHorizontal: globals.deviceWidth * 0.07,
    height: globals.deviceHeight * 0.065,
    backgroundColor: Colors.WHISPER,
  },

  /// MEDIA MODEL STYLE
  modelContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    width: "100%",
    
  },
  modelView: {
    backgroundColor: Colors.WHITE,
    width: "100%",
    borderRadius: 10,
  },
  titleviewstyle: {
    marginVertical: globals.deviceHeight * 0.01,
  },
  lineStyle: {
    height: globals.deviceHeight * 0.002,
    width: "100%",
    backgroundColor: Colors.PRIMARY,
    opacity: 0.6,
  },
  onlyFlex: {
    flex: 1,
  },
  choosefilestyle: {
    fontSize: globals.font_16,
    fontFamily: font_type.FontBold,
    color: Colors.PRIMARY,
    paddingTop: 18,
    paddingBottom: 18,
    textAlign: "center",
  },
  viewPopupStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 22,
  },
  imagePopupStyle: {
    height: hp(3),
    width: hp(3),
  },

  textStylePopup: {
    color: Colors.BLACK,
    fontSize: 16,
    fontFamily: font_type.FontRegular,
    fontWeight: "400",
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: globals.deviceWidth * 0.03,
  },
  lineStyle1: {
    height: Platform.OS == "ios" ? 0.1 : 0.5,
    width: "100%",
    backgroundColor: Colors.BLACK,
    opacity: 0.4,
  },

  ///// SPORTS TABS STYLE
  tabStyle: {
    borderColor: Colors.LITE_GREY,
    borderWidth: 2,
    shadowColor: Colors.WHISPER,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 10,
    elevation: 2,
    backgroundColor: Colors.LITE_GREY,
    marginTop: hp(3),
  },
  activeTabStyle: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  tabfontsize: {
    color: Colors.GREY,
    fontSize: globals.font_14,
    fontFamily: font_type.FontRegular,
    padding: 6,
  },
  activefontsize: {
    color: Colors.PRIMARY,
    fontSize: globals.font_14,
    fontFamily: font_type.FontBold,
    padding: 6,
    fontWeight: "bold",
  },

  //////// SPORTS VIEW
  sportstitleview: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontRegular,
    color: Colors.LITE_BLACK,
    width: "40%",
  },
  sportstitleviewbefore: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1),
    marginHorizontal: wp(1),
  },
  roundedview: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(11) / 2,
    backgroundColor: Colors.WHISPER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginHorizontal: wp(1),
  },
  sportsview: {
    flex: 1,
    // marginTop: hp(1),
    marginBottom: hp(3),
    marginHorizontal: wp(4),
  },
  spoprtsheadertext: {
    fontFamily: font_type.FontRegular,
    color: Colors.LITE_BLACK,
    marginHorizontal: wp(2),
    fontSize: RFPercentage(1.8),
    marginVertical: hp(2.5),
  },
  helpcentertext: {
    flexDirection: "row",
    marginBottom: hp(2),
    alignItems: "center",
    justifyContent: "center",
  },

  ///// QR CODE STYLE
  squareviewofQr: {
    padding: hp(5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.GREY,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  qrText: {
    textAlign: "center",
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
  },
});
