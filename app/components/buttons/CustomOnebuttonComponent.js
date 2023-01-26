import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { TabStyle } from "../../../assets/styles/TabStyle";

const CustomOnebuttonComponent = ({
  segmentOneTitle,
  segmentOneImage,
  onPressSegmentOne,
  squareView,
  CustomWidth,
  segmentOneTintColor,
  ...props
}) => {
  
  return (
    <View>
      <TouchableOpacity
        onPress={onPressSegmentOne}
        style={[TabStyle.squareView, { width:CustomWidth}, squareView]}
      >
        {segmentOneImage ? (
          <FastImage
         
            style={TabStyle.smallIconStyle}
            tintColor={segmentOneTintColor}
            source={segmentOneImage}
          ></FastImage>
        ) : null}

        <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
          {segmentOneTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default CustomOnebuttonComponent;
