import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { TabStyle } from "../../../assets/styles/TabStyle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constants/Colors";

const CustomTwoSegmentCoponent = ({
  segmentOneTitle,
  segmentOneImage,
  segmentTwoTitle,
  onPressSegmentOne,
  onPressSegmentTwo,
  segmentTwoImage,
  isSelectedTab,
  ...props
}) => {
  return (
    <View style={TabStyle.beforeSquareView}>
      <TouchableOpacity
        onPress={onPressSegmentOne}
        style={[
          TabStyle.squareView,
          {
            borderColor:
              isSelectedTab == "My_Player" || isSelectedTab == "Find_Match"
                ? Colors.PRIMARY
                : Colors.GREY,
          },
        ]}
      >
        <FastImage
          tintColor={
            isSelectedTab == "My_Player" ||
            isSelectedTab == "Find_Match" ||
            isSelectedTab == "true"
              ? Colors.PRIMARY
              : Colors.GREY
          }
          style={TabStyle.smallIconStyle}
          source={segmentOneImage}
          resizeMode="contain"
        ></FastImage>
        <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
          {segmentOneTitle}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressSegmentTwo}
        style={[
          TabStyle.squareView,
          {
            borderColor:
              isSelectedTab == "Find_Player" || isSelectedTab == "Create_Match"
                ? Colors.PRIMARY
                : Colors.GREY,
            marginHorizontal: wp(1),
          },
        ]}
      >
        <FastImage
          resizeMethod="resize"
          tintColor={
            isSelectedTab == "Find_Player" ||
            isSelectedTab == "Create_Match" ||
            isSelectedTab == "true"
              ? Colors.PRIMARY
              : Colors.GREY
          }
          style={[TabStyle.verysmallIcon, { marginHorizontal: wp(2) }]}
          source={segmentTwoImage}
          resizeMode="contain"
        ></FastImage>
        <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
          {segmentTwoTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default CustomTwoSegmentCoponent;
