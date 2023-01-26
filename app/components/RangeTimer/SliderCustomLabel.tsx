import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const width = 60;

function LabelBase(props) {
  const { position, value } = props;

  return (
    <View
      style={[
        styles.sliderLabel,
        {
          left: position - width / 2,
        },
      ]}
    >
      <Text style={styles.sliderLabelText}>{value}</Text>
    </View>
  );
}

export default function SliderCustomLabel(
  textTransformer: (value: number) => string
) {
  return function (props) {
    const {
      oneMarkerValue,
      twoMarkerValue,
      oneMarkerLeftPosition,
      twoMarkerLeftPosition,
    } = props;

    // console.log({props, oneMarkerLeftPosition, twoMarkerLeftPosition});

    return (
      <View>
        <LabelBase
          position={oneMarkerLeftPosition}
          value={textTransformer(oneMarkerValue)}
        />
        {twoMarkerValue ? (
          <LabelBase
            position={twoMarkerLeftPosition}
            value={textTransformer(twoMarkerValue)}
          />
        ) : null}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  sliderLabel: {
    // position: 'absolute',
    justifyContent: "center",
    top: 80,
    width: 60,
    height: 55,
    // backgroundColor:'red'
  },
  sliderLabelText: {
    textAlign: "center",
    lineHeight: width,
    flex: 1,
  },
});
