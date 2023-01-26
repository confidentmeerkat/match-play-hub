import { StyleSheet, Platform } from "react-native";
import Colors from "../../app/constants/Colors";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import font_type from "../../app/resources/fonts";
import * as globals from "../../app/utils/Globals";

export const Settingstyle = StyleSheet.create({
  lineViewContainer: {
    flexDirection: "row",
    marginHorizontal: globals.deviceWidth * 0.03,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.GREY,
    marginTop: globals.deviceHeight * 0.02,
    height: 0.4,
    marginBottom: globals.deviceHeight * 0.02,
  },
  container: { backgroundColor: Colors.WHITE, flex: 1 },
  headingview: {
    height: hp(5),
    marginHorizontal: wp(4),
  },
  headertext: {
    fontSize: RFPercentage(2.5),
    fontFamily: font_type.FontBold,
    color: Colors.BLACK,
  },
  subview: {
    flexDirection: "row",
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    justifyContent: "space-between",
    alignItems:'center'
  },
  globalPostview: {
    flexDirection: "row",
    marginHorizontal: wp(5),
    alignItems: "center",
    marginVertical: hp(1),
    // justifyContent: "space-between",
  },
  subtitleview: {
    fontSize: RFPercentage(2.2),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
    width: "60%",
  },
  endtitleview: {
    fontSize: RFPercentage(2.2),
    fontFamily: font_type.FontRegular,
    color: Colors.DARK_GREY,
    alignSelf: "flex-end",
  },
  nextview: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    padding: 2,
  },
  tab_Image: {
    width: 20,
    height: 20,
    tintColor: Colors.PRIMARY,
    alignSelf: "flex-end",
  },
  countryPickerView: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderEndColor: Colors.PRIMARY,
    borderEndWidth: 1,
  },
});
