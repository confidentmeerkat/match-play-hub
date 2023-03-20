import React, { Component } from "react";
import { TouchableOpacity, View, TextInput, Text } from "react-native";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";
import Colors from "../../constants/Colors";
import FastImage from "react-native-fast-image";
import images from "../../resources/images";
import CommonGooglePlaceAutoComplete from "../Dropdowns/CommonGooglePlaceAutoComplete";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const Search = ({
  iconStyle,
  onFilter,
  handleOnLocationSelect,
  selectedFilters,
  placeholder,
  ref,
  value,
  handletextInputProps,
  hideSearch,
}) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    {!hideSearch ?
      <View style={[ComponentStyle.searchContainer]}>
        {/* <FastImage
          style={[
            ComponentStyle.search_icon,
            iconStyle,
            { tintColor: Colors.GREY },
          ]}
          source={images.search_img}
          resizeMode={FastImage.resizeMode.contain}
        /> */}
        <CommonGooglePlaceAutoComplete
          handleOnLocationSelect={handleOnLocationSelect}
          placeholder={placeholder}
          isFrom="Search"
          ref={ref}
          handletextInputProps={handletextInputProps}
        />
      </View>
    :
      <View />
    }
    <TouchableOpacity
      style={{
        alignItems: "center",
        // justifyContent: "center",
        marginRight: 15,
      }}
      onPress={onFilter}
    >
      <FastImage
        style={[
          ComponentStyle.search_icon,
          iconStyle,
          { tintColor: Colors.LITE_GREY, marginTop: hp(2) },
        ]}
        source={images.filter_img}
        resizeMode={FastImage.resizeMode.contain}
      />
      {selectedFilters ? (
        <View style={ComponentStyle.search_roundedView}>
          <Text style={[ComponentStyle.search_Counttext]}>
            {selectedFilters}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  </View>
);

export default Search;
