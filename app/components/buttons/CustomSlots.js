import React from "react";
import { View, Text } from "react-native";
import Colors from "../../constants/Colors";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";

const CustomSlots = ({ titleText, customstyle, ...props }) => {
  return (
    <View style={[ComponentStyle.slotView,customstyle]}>
      <Text
        numberOfLines={1}
        style={[ComponentStyle.smallRegularText, { color: Colors.WHITE }]}
      >
        {titleText}
      </Text>
    </View>
  );
};
export default CustomSlots;
