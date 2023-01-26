import { StyleSheet, Platform } from "react-native";
import Colors from "../../app/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import font_type from "../../app/resources/fonts";
import * as globals from "../../app/utils/Globals";

export const TabStyle = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
    marginHorizontal: wp(5),
  },
  dotView: {
    height: hp(1),
    width: hp(1),
    borderWidth: 0.1,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY,
    borderRadius: hp(1) / 2,
    alignSelf: "flex-start",
    marginVertical: hp(1.5),
    marginHorizontal: wp(1.5),
  },
  emptyview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptytext: {
    color: Colors.GREY,
    fontSize: globals.font_14,
    fontWeight: "bold",
    width: globals.deviceWidth,
    fontFamily: font_type.FontRegular,
    alignSelf: "center",
    textAlign: "center",
  },

  /// SEGMENT COMPONENT STYLE

  beforeSquareView: {
    flexDirection: "row",
    marginVertical: hp(2),
    justifyContent: "space-between",
    alignItems: "center",
  },
  squareView: {
    paddingVertical: hp(1.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LITE_GREY,
    width: "48%",
    borderColor: Colors.GREY,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: wp(3),
  },
  smallCheckbox: {
    height: globals.deviceWidth * 0.055,
    width: globals.deviceWidth * 0.055,
    borderColor: Colors.GREY,
    borderWidth: 1,
    borderRadius: 1,
  },
  confirmCheckbox: {
    height: hp(3.5),
    width: wp(24),
    borderColor: Colors.GREY,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(0.3),
  },
  fullwidthSquareView: {
    paddingVertical: hp(1.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
    width: "95%",
    borderColor: Colors.GREY,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: wp(3),
  },
  mapwidthView: {
    paddingVertical: hp(1.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GREY,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: wp(3),
  },
  smallIconStyle: {
    width: wp(5),
    height: wp(5),
    marginHorizontal: wp(2),
  },
  calenderDropDown: {
    width: wp(3),
    height: wp(3),
    marginRight: wp(4),
  },
  smalltextview: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontSemiBold,
    color: Colors.DARK_GREY,
  },
  alrtTexts: {
    color: Colors.BLACK,
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontSemiBold,
    color: Colors.BLACK,
  },
  smallConfirmplayertext: {
    fontSize: RFPercentage(1.7),
    fontFamily: font_type.FontRegular,
    color: Colors.PRIMARY,
  },
  deleteAccText: {
    fontSize: RFPercentage(1.8),
    fontFamily: font_type.FontRegular,
    color: Colors.BLACK,
  },
  roundedview: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(11) / 2,
    backgroundColor: Colors.LITE_GREY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(1),
  },
  sportsview: {
    flex: 1,
    marginTop: hp(2),
    marginBottom: hp(3),
    marginHorizontal: wp(4),
  },

  /// MATCHVIEW SCREEN STYLE
  smallheadertext: {
    fontSize: RFPercentage(2.1),
    fontFamily: font_type.FontBold,
    color: Colors.BLACK,
    marginBottom: 1,
  },
  headertext: {
    fontSize: RFPercentage(2.3),
    fontFamily: font_type.FontBold,
    color: Colors.BLACK,
    marginBottom: 1,
  },
  onlyFlex: {
    flex: 1,
  },
  mainFlatView: {
    width: "100%",
    borderColor: Colors.GREY,
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: "row",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    marginVertical: hp(0.8),
  },
  FlatinnerView: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(1),
  },
  lineView: {
    marginHorizontal: wp(3),
    height: globals.deviceHeight * 0.09,
    backgroundColor: Colors.PRIMARY,
    width: 2,
  },
  shortLine: {
    marginHorizontal: wp(4),
    height: globals.deviceHeight * 0.05,
    backgroundColor: Colors.PRIMARY,
    width: 1,
  },
  horizontalView: {
    marginVertical: hp(1),
    backgroundColor: Colors.GREY,
    height: hp(0.1),
  },
  dayTimeView: {
    fontSize: RFPercentage(1.5),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
  },
  verysmallIcon: {
    width: wp(4),
    height: wp(4),
    marginTop: 1,
  },
  mapIcon: {
    width: wp(3),
    height: wp(3),
    marginTop: 1,
    marginLeft: 1.5,
  },
  matchesStatusview: {
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    alignSelf: "flex-end",
    top: hp(1),
    right: wp(1.5),
    paddingHorizontal: wp(1),
    marginVertical: hp(0.5),
  },

  ///////PLAY TAB STYLE
  userImg: {
    height: globals.deviceWidth * 0.2,
    width: globals.deviceWidth * 0.2,
    borderWidth: 0.1,
    borderColor: Colors.PRIMARY,
    borderRadius: (globals.deviceWidth * 0.2) / 2,
  },
  smalluserImg: {
    height: globals.deviceWidth * 0.18,
    width: globals.deviceWidth * 0.18,
    borderRadius: (globals.deviceWidth * 0.2) / 2,
  },
  lineSpacing: {
    marginHorizontal: wp(1),
  },
  mainBottomFlatView: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    marginVertical: hp(0.8),
    alignItems: "center",
  },

  ////////// CREATE MATCH SCREEN STYLE

  dateandtimeview: {
    marginHorizontal: globals.deviceWidth * 0.065,
    padding: 5,
  },
  touchableview: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    height: hp(7.5),
    width: "100%",
    backgroundColor: Colors.LITE_GREY,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.LITE_GREY,
    alignItems: "center",
    paddingLeft: 8,
  },
  LevelHorizontalView: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: globals.deviceWidth * 0.05,
    marginVertical: hp(1),
  },
  dropdownmargins: {
    marginHorizontal: globals.deviceWidth * 0.05,
    marginVertical: hp(1),
  },
  matchdetailmargins: {
    marginHorizontal: globals.deviceWidth * 0.05,
    marginVertical: hp(0.5),
  },
  marginfromallside: {
    marginHorizontal: globals.deviceWidth * 0.05,
    marginVertical: hp(3),
  },
  completedView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHISPER,
    marginBottom: hp(3),
    padding: hp(1.5),
  },
  chooseFontStyle: {
    fontFamily: font_type.FontRegular,
    color: Colors.BLACK,
    textAlign: "left",
    // fontSize: globals.font_15,
    fontSize: Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2),
  },
  imageStyle: {
    height: globals.deviceWidth * 0.27,
    width: globals.deviceWidth * 0.27,
    // borderWidth: 2.5,
    // borderColor: Colors.PRIMARY,
    borderRadius: (globals.deviceWidth * 0.27) / 2,
  },
  smallimgStyle: {
    height: globals.deviceWidth * 0.1,
    width: globals.deviceWidth * 0.1,
    borderRadius: (globals.deviceWidth * 0.1) / 2,
  },
  medimgStyle: {
    height: globals.deviceWidth * 0.16,
    width: globals.deviceWidth * 0.16,
    borderRadius: (globals.deviceWidth * 0.16) / 2,
  },
  plyersimageView: {
    alignItems: "center",
    marginVertical: hp(0.5),
    marginHorizontal: wp(0.2),
    flexDirection: "row",
  },
  plyersImageStyle: {
    height: globals.deviceWidth * 0.07,
    width: globals.deviceWidth * 0.07,
    borderRadius: (globals.deviceWidth * 0.07) / 2,
  },
  plyersLimitText: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontSemiBold,
    color: Colors.PRIMARY,
    marginHorizontal: wp(1),
  },
  renderSportsFlatview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(0.7),
    marginTop: hp(1),
    flex: 1,
  },
  horizontalFlatView: {
    borderColor: Colors.GREY,
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    marginVertical: hp(0.8),
    flex: 1,
    width: wp(70),
  },
  befoewSearchview: {
    marginVertical: hp(3),
    marginHorizontal: wp(5),
  },
  dropDownbtnStyle: {
    height: 50,
    width: "100%",
    backgroundColor: Colors.LITE_GREY,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.LITE_GREY,
  },

  /////// SECTION STYLE VIEWS
  sectionTitleView: {
    backgroundColor: Colors.WHISPER,
    paddingVertical: hp(1),
  },
  pendingrequestView: {
    flex: 0.7,
    marginBottom: hp(1),
  },
  sectionlistingView: {
    marginVertical: hp(1),
  },
  multipleSports: {
    width: wp(30),
    color: Colors.ORANGE,
    marginVertical: hp(1),
  },
  singleSports: {
    width: wp(40),
  },
  locationicon: {
    height: hp(1.8),
    width: hp(1.8),
  },
  /////////////////// LIST MATCH VIEW style
  horizontalMatchFlatView: {
    borderColor: Colors.GREY,
    borderWidth: 0.2,
    borderRadius: 15,
    marginVertical: hp(0.8),
    borderWidth: 0.5,
    shadowColor: Colors.LITE_BLACK,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginHorizontal: wp(3),
    paddingRight: wp(2),
    paddingLeft: wp(5),
    paddingVertical: hp(2),
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  submatchview: {
    flexDirection: "row",
    alignItems: "center",
  },
  centerLocationtext: {
    marginHorizontal: globals.deviceWidth * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  locationMatchView: {
    marginVertical: hp(1.5),
    marginLeft: wp(14),
  },
  rowFlexDiretion: {
    flexDirection: "row",
  },
  slotsView: {
    flexDirection: "row",
    marginVertical: hp(2),
  },
  secondSlotStyle: {
    marginLeft: wp(2),
    opacity: 0.5,
  },
  organizerview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },
  centerOrganizerInfo: {
    marginLeft: wp(10),
    alignItems: "center",
    justifyContent: "center",
  },

  ///// Interest Players screen
  interestedPlayerView: {
    marginHorizontal: wp(5),
    // flex: 1,
    marginBottom: hp(5),
  },
  interestedPlayermainFlatvew: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 0.2,
    paddingVertical: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
  },

  /// Invited players list
  invitedfrndsListView: {
    alignSelf: "center",
    marginTop: hp(1.5),
    marginBottom: hp(3),
  },
  calandarPopupView: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: wp(2),
  },
  closeCalendarPopup: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
  },
  calendarContainer: {
    flexDirection: "row",
    paddingVertical: 2,
    // width: "85%",
    paddingHorizontal: 5,
    alignItems: "center",
    backgroundColor: Colors.LITE_GREY,
    // zIndex: 0,
    marginHorizontal: globals.deviceWidth * 0.05,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.LITE_GREY,
    marginBottom: 5.5,
  },
  subtitleview: {
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
  },

  ///// sports search filter
  sposrtselectionView: {
    marginVertical: 5,
    backgroundColor: Colors.WHISPER,
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.WHISPER,
  },
  alrtview: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(5),
  },
  chatUserinfo: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(5),
    marginBottom: hp(1.5),
    // paddingBottom: hp(0.1),
  },
  chatbottomline: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 0.5,
  },
  bottomComponentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rendersendContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    backgroundColor: Colors.PRIMARY,
    marginBottom: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  renderactionschat: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    // marginRight: -2,
    marginBottom: 6,
  },
  sectionHeader: {
    paddingTop: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 8,
    fontSize: RFPercentage(2),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
    backgroundColor: Colors.LITE_GREY,
    textAlign: "center",
  },
  sportsmodel: {
    flex: 0.85,
    borderRadius: 10,
    borderWidth: 0.5,
    width: "100%",
    backgroundColor: Colors.WHITE,
    borderColor: Colors.WHITE,
  },
  closebtnofmodel: {
    alignItems: "center",
    height: hp(5.5),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: Colors.PRIMARY,
    borderWidth: 0.5,
    justifyContent: "center",
    backgroundColor: Colors.PRIMARY,
    marginTop:hp(1)
  },
  // chatimage:{
  //   image: {
  //     width: 150,
  //     height: 100,
  //     borderRadius: 13,
  //     margin: 3,
  //     resizeMode: 'cover',
  //   },
  // }
});
