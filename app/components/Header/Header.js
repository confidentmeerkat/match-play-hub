import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import FastImage from "react-native-fast-image";
import images from "../../resources/images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constants/Colors";
import font_type from "../../resources/fonts";
import * as globals from "../../utils/Globals";
import strings from "../../resources/languages/strings";
import { RFPercentage } from "react-native-responsive-fontsize";
import { CommonActions } from "@react-navigation/native";
import { EventRegister } from "react-native-event-listeners";
const Header = ({
  headerText,
  headerIcon,
  isHideBack,
  comingFrom,
  isShowRighttwo,
  isHideSetting,
  isFrom,
  clearStates,
  isGoBack,
  props,
}) => {
  const gotoSetting = async () => {
    props.navigation.navigate("Setting");
  };
  const gotoBack = async () => {
    isFrom == "HelpCenter"
      ? props.navigation.goBack()
      : isFrom == "FindPlayer"
      ? refreshCurrentUser()
      : isFrom == "EditProfile" && isGoBack == true
      ? askbeforeLeave()
      : isFrom == "notification"
      ? props.navigation.navigate("Home") // refreshsddasCurrentUser("Home")
      : props.navigation.goBack();
  };
  const refreshsddasCurrentUser = (route) => {
    let resetAction = CommonActions.reset({
      index: 1,
      key: null,
      routes: [{ name: route }],
    });
    props.navigation.dispatch(resetAction);
  };

  const refreshCurrentUser = () => {
    EventRegister.emit("initializeApp");
    props.navigation.goBack();
  };

  const askbeforeLeave = async () => {
    Alert.alert(globals.appName, strings.gobackwithoutsave, [
      {
        text: "OK",
        onPress: clearStates,
      },
      {
        text: "Cancel",
        onPress: () => {},
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.headerContainer]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={styles.headerContain}>
        {isHideBack == true ? (
          <TouchableOpacity
            style={{ width: wp(15), justifyContent: "center" }}
            onPress={gotoBack}
          >
            <View style={{ padding: 5 }}>
              <FastImage
                style={styles.logoimgStyle}
                tintColor={Colors.PRIMARY}
                source={images.back_arrow_img}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              marginLeft: -wp(5),
            }}
          />
        )}

        <View
          style={{
            width: isShowRighttwo == true ? wp(55) : wp(70),
          }}
        >
          <Text style={[styles.logoText]}>{headerText}</Text>
        </View>
        {isHideSetting == true ? (
          <TouchableOpacity
            style={{ width: wp(15), height: hp(5), justifyContent: "center" }}
            onPress={gotoSetting}
          >
            <FastImage
              style={styles.logoimgStyle}
              source={images.settings_img}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: wp(4),
              height: wp(4),
              marginLeft: 15,
              marginRight: 20,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
  },
  touchableviewStyle: {
    width: wp(10),
    height: hp(5),
    justifyContent: "center",
  },
  backtouchableView: {
    width: wp(10),
    height: hp(5),
    justifyContent: "center",
  },
  logoText: {
    color: Colors.BLACK,
    fontSize: RFPercentage(2.5),
    fontFamily: font_type.FontSemiBold,
  },
  imgStyle: {
    width: wp(4),
    height: wp(4),
    marginLeft: 15,
    marginRight: 20,
  },
  logoimgStyle: {
    width: wp(6),
    height: wp(6),
    marginLeft: 15,
    marginRight: 20,
  },
  headerContainer: {
    backgroundColor: Colors.WHITE,
    // paddingTop: Platform.OS === "android" ? globals.deviceHeight * 0.04 : 0,
    // borderBottomColor: Colors.GREY,
    // borderBottomWidth: 1,
  },
  headerContain: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    justifyContent: "space-between",
  },
});

export default Header;
