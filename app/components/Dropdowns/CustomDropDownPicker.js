import React from "react";
import SelectDropdown from "react-native-select-dropdown";
import Colors from "../../constants/Colors";
import images from "../../resources/images";
import FastImage from "react-native-fast-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";

const CustomDropDownPicker = ({
  onSelect,
  data,
  buttonTextAfterSelection,
  rowTextForSelection,
  defaultButtonText,
  isOpened,
  ...props
}) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={onSelect}
      renderDropdownIcon={() => {
        return (
          <FastImage
            style={{ width: wp(3), height: wp(3), marginRight:10 }}
            tintColor={Colors.BLACK}
            source={images.down_arrow_img}
          />
        );
      }}
      defaultButtonText={defaultButtonText}
      buttonTextAfterSelection={buttonTextAfterSelection}
      rowTextForSelection={rowTextForSelection}
      dropdownIconPosition={"right"}
      buttonStyle={ComponentStyle.dropDownbtnStyle}
      buttonTextStyle={ComponentStyle.dropDownbtnTextStyle}
      dropdownStyle={{ backgroundColor: Colors.WHITE }}
      rowStyle={ComponentStyle.dropDownrowStyle}
      rowTextStyle={ComponentStyle.dropDownrowTextStyle}
    />
  );
};
export default CustomDropDownPicker;
