import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Loader = (props, isFrom) => (
  <View
    style={[
      styles.indicatorView,
      {
        top: 0,
        left: (isFrom = "Play" ? -wp(5) : 0),
        right: (isFrom = "Play" ? -wp(5) : 0),
        bottom: 0,
      },
    ]}
  >
    <ActivityIndicator color={Colors.PRIMARY} size="large" />
  </View>
);

const styles = StyleSheet.create({
  indicatorView: {
    position: "absolute",

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default Loader;
