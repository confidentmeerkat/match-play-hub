import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";
import Colors from "../../constants/Colors";
import strings from "../../resources/languages/strings";
import font_type from "../../resources/fonts";

const SearchMessage = ({
  titleText,
  isClearFilter,
  clearFilters,
  ...props
}) => {
  return (
    <View style={{ marginHorizontal: 8, marginBottom: isClearFilter ? 10 : 0 }}>
      <Text
        style={[
          ComponentStyle.smallRegularText,
          { fontFamily: font_type.FontRegular },
        ]}
      >
        {titleText}
      </Text>
      {isClearFilter ? (
        <TouchableOpacity onPress={clearFilters} style={{ width: "40%" }}>
          <Text
            style={[ComponentStyle.smallRegularText, { color: Colors.PRIMARY }]}
          >
            {strings.clearFilter}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default SearchMessage;
