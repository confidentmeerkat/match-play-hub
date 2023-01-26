import { StyleSheet, Platform } from "react-native";
import Colors from "../../app/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import font_type from "../../app/resources/fonts";
import * as globals from "../../app/utils/Globals";
export const ComponentStyle = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    // marginTop: globals.deviceHeight * 0.02,
    paddingTop: Platform.OS === "android" ? globals.deviceHeight * 0.015 : 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GREY,
  },
  headerContain: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  horizontalView: {
    marginVertical: hp(1),
    height: hp(0.1),
  },
  titleText: {
    fontSize: RFPercentage(3),
    fontFamily: font_type.FontSemiBold,
    color: Colors.BLACK,
    marginLeft: -wp(5),
  },
  tab_Image: { width: 30, height: 30, tintColor: Colors.PRIMARY },
  roundedtab_img: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    tintColor: Colors.PRIMARY,
  },
  dropdown_row: {
    flexDirection: "row",
    height: hp(5),
    width: wp(25),
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
  },
  dropdown_row_text: {
    marginHorizontal: 14,
    fontFamily: font_type.FontRegular,
    fontSize: globals.font_14,
    color: Colors.WHITE,
    textAlignVertical: "center",
    textAlign: "center",
  },
  dropdown: {
    // width: wp(25),
    // height: hp(10),
    // flex: 1,
    backgroundColor: "yellow",
  },
  placeholder_font: {
    color: Colors.PRIMARY,
    fontFamily: font_type.FontRegular,
    fontSize: globals.font_14,
  },
  pickerinput: {
    height: hp(4),
    marginHorizontal: 20,
    marginTop: 20,
  },

  //// SEARCH COMPONENT
  searchContainer: {
    flexDirection: "row",
    // height: hp(6),

    width: "85%",
    paddingVertical: 3,
    paddingHorizontal: 15,
    // alignContent: "center",
    alignItems: "center",
    // justifyContent: "center",
    // marginHorizontal: globals.deviceWidth * 0.05,
    // marginVertical: globals.deviceHeight * 0.01,
    backgroundColor: Colors.LITE_GREY,
    borderColor: Colors.LITE_GREY,
    borderWidth: 0.1,
    borderRadius: 15,
    // shadowColor: Platform.OS == "android" ? "#000" : Colors.BLACK_TRANSPARENT,
    // shadowOffset: {
    //   width: 2,
    //   height: 12,
    // },
    // shadowOpacity: 0.38,
    // shadowRadius: 16,
    // elevation: 24,
    zIndex: 0,
  },
  searchbynameContainer: {
    flexDirection: "row",
    height: hp(6),
    width: "85%",
    paddingVertical: 3,
    paddingHorizontal: 15,
    // alignContent: "center",
    alignItems: "center",
    // justifyContent: "center",
    // marginHorizontal: globals.deviceWidth * 0.05,
    // marginVertical: globals.deviceHeight * 0.01,
    backgroundColor: Colors.WHISPER,
    borderColor: Colors.WHITE,
    borderWidth: 0.1,
    borderRadius: 15,
    shadowColor: Platform.OS == "android" ? "#000" : Colors.BLACK_TRANSPARENT,
    shadowOffset: {
      width: 2,
      height: 12,
    },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 24,
    zIndex: 0,
  },

  search_inputText: {
    fontFamily: font_type.FontRegular,
    fontSize: globals.font_14,
    marginHorizontal: wp(2),
    width: globals.deviceWidth * 0.6,
    color: Colors.BLACK,
  },
  search_icon: {
    width: hp(2.5),
    height: hp(2.5),
    alignSelf: "center",
  },
  small_close_icon: {
    width: hp(1.5),
    height: hp(1.5),
    alignSelf: "center",
  },
  search_roundedView: {
    position: "absolute",
    width: wp(5),
    height: wp(5),
    borderRadius: wp(5) / 2,
    backgroundColor: Colors.ORANGE,
    alignItems: "center",
    left: 10,
    top: 10,
  },
  search_Counttext: {
    fontSize: RFPercentage(1.9),
    fontFamily: font_type.FontRegular,
    color: Colors.WHITE,
  },

  /// CUSTOM DROPDOWN COMPONENT
  dropDownbtnStyle: {
    height: hp(7.5),
    width: "100%",
    backgroundColor: Colors.LITE_GREY,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.LITE_GREY,
    marginLeft: 15,
  },
  dropDownbtnTextStyle: {
    fontFamily: font_type.FontRegular,
    color: Colors.BLACK,
    textAlign: "left",
    // fontSize: globals.font_15,
    fontSize: Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2),
    marginLeft: 1.2,
  },
  dropDownrowStyle: {
    backgroundColor: Colors.WHITE,
    borderBottomColor: "#C5C5C5",
  },
  dropDownrowTextStyle: {
    fontFamily: font_type.FontRegular,
    color: Colors.BLACK,
    textAlign: "left",
    fontSize: globals.font_15,
  },
  ///////// HEADING WITH TEXT STYLE
  horizontalLineView: {
    width: globals.deviceWidth,
    backgroundColor: Colors.GREY,
    opacity: 0.5,
    height: hp(0.1),
    marginLeft: wp(1),
  },
  headingtexts: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontBold,
    color: Colors.BLACK,
  },
  headingtextView: {
    flexDirection: "row",
    alignItems: "center",
  },
  labeltexts: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontBold,
    color: Colors.GREY,
  },
  labelrequired: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontBold,
    color: Colors.ORANGE,
  },
  /// CUSTOM SLOTS STYLES
  slotView: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: wp(0.1),
    paddingVertical: hp(0.6),
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    width: wp(30),
  },
  smallRegularText: {
    fontSize: RFPercentage(1.6),
    fontFamily: font_type.FontSemiBold,
    color: Colors.BLACK,
  },
});
