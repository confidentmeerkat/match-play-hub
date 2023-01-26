import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { TabStyle } from "../../../assets/styles/TabStyle";
import images from "../../resources/images";

const gotoDestination = (item, index, isFrom, navigation) => {
  isFrom == "hubPlayerRequest"
    ? navigation.navigation.navigate("PendingConnectionDetail", {
        other_user_info: item,
      })
    : isFrom == "hubMessageRequest"
    ? navigation.navigation.navigate("ChatDetail", {
        other_user_info_Id: item.user_id,
      })
    : null;
};

const renderconfirmedPlayersListview = (item, index, isFrom, navigation) => {
  return (
    <TouchableOpacity
      onPress={() => gotoDestination(item, index, isFrom, navigation)}
      style={TabStyle.renderSportsFlatview}
    >
      <FastImage
        style={TabStyle.smallimgStyle}
        source={
          item.profile_url === ""
            ? images.dummy_user_img
            : { uri: item.profile_url }
        }
      ></FastImage>
    </TouchableOpacity>
  );
};

const HoriZontalFlatList = ({ data, isFrom, navigation, ...props }) => {
  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item, index }) =>
          renderconfirmedPlayersListview(item, index, isFrom, navigation)
        }
        bounces={false}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        listKey={(item, index) => "D" + index.toString()}
        keyExtractor={(item, index) => "D" + index.toString()}
      />
    </>
  );
};
export default HoriZontalFlatList;
