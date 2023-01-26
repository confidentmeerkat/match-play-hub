import React, { Component } from "react";
import Colors from "../../constants/Colors";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import font_type from "../../resources/fonts";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const MultiSelectDropDown = ({
  Options,
  Icon,
  onSelectedAvailibilityItemsChange,
  onSelectedRoomChange,
  selectedItems,
  selectText,
  subKey,
}) => (
  <SectionedMultiSelect
    items={Options}
    IconRenderer={Icon}
    uniqueKey="id"
    subKey={subKey}
    selectText={selectText}
    showDropDowns={false}
    hideSearch={true}
    showChips={true}
    alwaysShowSelectText={true}
    animateDropDowns={true}
    readOnlyHeadings={true}
    modalWithTouchable
    hideConfirm={false}
    confirmText={"Close"}
    colors={{
      primary: Colors.PRIMARY,
      success: Colors.PRIMARY,
      chipColor: Colors.PRIMARY,
    }}
    styles={{
      // container: {
      //   flex: 0,
      //   flexDirection: "row",
      //   alignContent: "center",
      //   justifyContent: "center",
      //   alignSelf: "center",
      //   marginTop: globals.deviceHeight *0.4,
      // },

      // chipContainer: {
      //   backgroundColor: Colors.LITE_GREY,
      //   color: Colors.WHITE,
      // },
      button: {height: hp(5), alignItems:'center', justifyContent:'center' }, 
      label: {
        fontWeight: "bold",
        fontFamily: font_type.FontBold,
        fontSize:
          Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2), // ignored on Android
      },
      // item: {
      //   paddingHorizontal: 10,
      // },
      subItem: {
        paddingVertical: 10,
        fontWeight: "bold",
        fontFamily: font_type.FontBold,
        fontSize:
          Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2), // ignored on Android
      },
      selectedItem: {
        backgroundColor: "rgba(0,0,0,0.1)",
      },
      selectedSubItem: {
        backgroundColor: "rgba(0,0,0,0.1)",
      },
      itemText: {
        fontFamily: font_type.FontBold,
        fontWeight: "bold",
        color: Colors.PRIMARY,
        fontSize:
          Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2), // ignored on Android
      },
      subItemText: {
        fontFamily: font_type.FontBold,
        color: Colors.BLACK,
        fontWeight: "bold",
        fontSize:
          Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2), // ignored on Android
      },
      selectedSubItemText: {
        fontFamily: font_type.FontBold,
        fontWeight: "bold",
        fontSize:
          Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2), // ignored on Android
      },

      searchTextFontFamily: "MyCustomFont",
      // chipIcon: {
      //   color: "white",
      // },
    }}
    itemFontFamily={{
      fontFamily: font_type.FontRegular,
      fontSize: Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2),
    }}
    subItemFontFamily={{
      fontFamily: font_type.FontRegular,
      fontSize: Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2),
    }}
    searchTextFontFamily={{
      fontFamily: font_type.FontRegular,
      fontSize: Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2),
    }}
    confirmFontFamily={{
      fontFamily: font_type.FontRegular,
      fontSize: Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2),
    }}
    itemNumberOfLines={3}
    selectLabelNumberOfLines={3}
    modalWithSafeAreaView
    chipsPosition="bottom"
    onSelectedItemsChange={onSelectedAvailibilityItemsChange}
    onSelectedItemObjectsChange={onSelectedRoomChange}
    selectedItems={selectedItems}
  />
);

export default MultiSelectDropDown;
