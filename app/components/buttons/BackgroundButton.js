import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import Colors from "../../constants/Colors";
import font_type from "../../resources/fonts";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 10,
    flexDirection:'row',
    width: wp(90),
    height: hp(7),
    justifyContent: "center",
    alignItems: "center",
  },
  txtTitle: {
    color: Colors.white,
    fontSize: RFPercentage(3),
    fontFamily: font_type.FontSemiBold,
  },
  smallIconStyle: {
    width: wp(5),
    height: wp(5),
    marginHorizontal: wp(2),
  },
});

export default class BackgroundButton extends PureComponent {
  render() {
    const {
      title,
      backgroundColor,
      borderRadius,
      textColor,
      fontFamily,
      fontSize,
      width,
      height,
      borderColor,
      borderWidth,
      isImage,btnImage
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderRadius: borderRadius,
            width: width,
            height: height,
          },
        ]}
      >
        {isImage ? (
          <FastImage
            resizeMethod="resize"
            tintColor={Colors.PRIMARY}
            style={styles.smallIconStyle}
            source={btnImage}
          ></FastImage>
        ) : null}
        <Text
          style={[
            styles.txtTitle,
            { color: textColor, fontFamily: fontFamily, fontSize: fontSize },
          ]}
        >
          {title}
        </Text>
      </View>
    );
  }
}
