import React from "react";
import { View, Text } from "react-native";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";

const LabelWithText = ({
  titleText,
  marginVerticalview,
  marginLeftview,
	required,
  ...props
}) => {
  return (
    <View
      style={[
        ComponentStyle.headingtextView,
        { marginVertical: marginVerticalview, marginLeft: marginLeftview },
      ]}
    >
      <Text style={ComponentStyle.labeltexts}>{titleText}</Text>
			{required ?
				<Text style={ComponentStyle.labelrequired}>*</Text>
			: null }
    </View>
  );
};
export default LabelWithText;
