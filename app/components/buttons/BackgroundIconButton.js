import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import font_type from '../../resources/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 10,
    width: wp(90),
    height: hp(7),
    alignItems: 'center',
    flexDirection: 'row',
  },
  txtTitle: {
    color: Colors.white,
    fontSize: RFPercentage(3),
    textAlign: 'center',
    fontFamily: font_type.FontSemiBold,
    flex: 1,
  },
  imgIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: Colors.WHITE,
    position: 'absolute',
    start: wp(5),
  },
});

export default class BackgroundIconButton extends PureComponent {
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
      icon = undefined,
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor,
            borderRadius: borderRadius,
            width: width,
            height: height,
          },
        ]}>
        <Image source={icon} style={styles.imgIcon} />
        <Text
          style={[
            styles.txtTitle,
            {color: textColor, fontFamily: fontFamily, fontSize: fontSize},
          ]}>
          {title}
        </Text>
      </View>
    );
  }
}
