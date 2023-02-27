import React from "react";
import { View, Text } from "react-native";
import Colors from "../../constants/Colors";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";
import { moderateScale } from "../../utils/metrics";

const CustomSlots = ({ titleText, customstyle, ...props }) => {
  return (
    <View style={[ComponentStyle.slotView, customstyle]}>
      <Text
        numberOfLines={1}
        style={[ComponentStyle.smallRegularText, { color: Colors.WHITE, fontSize: moderateScale(10) }]}
      >
        {titleText}
      </Text>
    </View>
  );
};
export default CustomSlots;
