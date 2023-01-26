import React, { PureComponent } from "react";
import { Image, Text, View, StyleSheet, Platform } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RFPercentage } from "react-native-responsive-fontsize";
import images from "../../resources/images";
import Colors from "../../constants/Colors";
import font_type from "../../../app/resources/fonts";

class HomeTabItem extends PureComponent {
  render() {
    const { isRouteActive, routeIndex, route } = this.props;
    let icon;
    switch (routeIndex) {
      case 0:
        icon = isRouteActive
          ? images.fill_match_img
          : images.fill_match_gray_img;

        break;
      case 1:
        icon = isRouteActive ? images.player_img : images.fill_player_gray_img;
        break;
      case 2:
        icon = isRouteActive ? images.fill_home_img : images.fill_home_gray_img;
        break;

      default:
        icon = isRouteActive
          ? images.fill_match_img
          : images.fill_match_gray_img;
        break;
    }
    return (
      <View style={styles.container}>
        <View style={[styles.iconView]} />
        <Image source={icon} style={styles.icon} />
        <Text style={[styles.smalltextview,{
          color: isRouteActive ? Colors.BLACK :Colors.GREY,
        }]}>{route}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: Colors.GREY,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: Platform.OS === "android" ? 20 : 30,
    alignItems: "center",
  },
  smalltextview: {
    fontSize: RFPercentage(1.7),
    fontFamily: font_type.FontBold,
    marginVertical:2
  },
  iconView: {
    height: 5,
    width: wp(6),
    marginBottom: 15,
  },
  icon: {
    width: wp(8),
    height: wp(8),
  },
});

export default HomeTabItem;
