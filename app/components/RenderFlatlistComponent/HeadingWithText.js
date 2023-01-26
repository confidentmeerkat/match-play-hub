import React from "react";
import { View, Text } from "react-native";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";

const HeadingWithText = ({
  titleText,
  marginVerticalview,
  bigcontainerstyle,
  marginLeftview,
  ...props
}) => {
  return (
    <View
      style={[
        ComponentStyle.headingtextView,
        { marginVertical: marginVerticalview, marginLeft: marginLeftview },
      ]}
    >
      <Text style={ComponentStyle.headingtexts}>{titleText}</Text>
      <View
        style={[ComponentStyle.horizontalLineView, bigcontainerstyle]}
      ></View>
    </View>
  );
};
export default HeadingWithText;
