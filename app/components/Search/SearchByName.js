import React, { Component } from "react";
import { TouchableOpacity, View, TextInput, Text } from "react-native";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";
import Colors from "../../constants/Colors";
import FastImage from "react-native-fast-image";
import images from "../../resources/images";

const SearchByName = ({
  searchMessage,
  returnKeyType,
  forwardRef,
  onSubmitEditing,
  inputStyle,
  placeholderText,
  blurOnSubmit,
  onChangeText,
  keyboardType,
  maxLength,
  autoCapitalize,
  iconStyle,
  onPress,
  value,
  onBlurEffect,
  onFilter,
}) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <View style={[ComponentStyle.searchbynameContainer]}>
      <FastImage
        style={[
          ComponentStyle.search_icon,
          iconStyle,
          { tintColor: Colors.GREY },
        ]}
        source={images.search_img}
        resizeMode={FastImage.resizeMode.contain}
      />

      <TextInput
        value={value}
        searchMessage={searchMessage}
        returnKeyType={returnKeyType}
        ref={forwardRef}
        onSubmitEditing={onSubmitEditing}
        style={[
          ComponentStyle.search_inputText,
          inputStyle,
          {
            borderColor: Colors.WHITE,
          },
        ]}
        placeholder={placeholderText}
        placeholderTextColor={Colors.GREY}
        blurOnSubmit={blurOnSubmit}
        onChangeText={onChangeText}
        maxLength={26}
        minLength={2}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        underlineColorAndroid="transparent"
        autoFocus={false}
        onBlur={onBlurEffect}
      />
    </View>
    <TouchableOpacity
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
      }}
      onPress={onFilter}
    >
      <FastImage
        style={[
          ComponentStyle.search_icon,
          iconStyle,
          { tintColor: Colors.GREY },
        ]}
        source={images.filter_img}
        resizeMode={FastImage.resizeMode.contain}
      />
    </TouchableOpacity>
  </View>
);

export default SearchByName;
