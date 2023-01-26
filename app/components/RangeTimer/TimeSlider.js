import React, { PureComponent } from "react";
import { View } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import SliderCustomLabel from "./SliderCustomLabel";
import Colors from "../../constants/Colors";

export const TimeSlider = ({
  onValuesChangeFinish,
  onLayout,
  width,
  selected,
}) => {
  const TIME = { min: 0, max: 86399 };
  const SliderPad = 12;
  const { min, max } = TIME;

  const textTransformerTimes = (value) => {
    value = Number(value);
    var h = Math.floor(value / 3600);
    var m = Math.floor((value % 3600) / 60);

    if (h === 23 && m === 59) {
      return "11:59pm";
    } else {
      return h === 0
        ? "12:00am"
        : (h < 13 ? h : h - 12) +
            ":" +
            (m > 30
              ? 30 + (h < 12 ? "am" : "pm")
              : "00" + (h < 12 ? "am" : "pm"));
    }
  };

  return (
    <View
      onLayout={onLayout}
      style={{
        flex: 1,
        marginTop: -80,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MultiSlider
        min={min}
        max={max}
        isMarkersSeparated={false}
        // minMarkerOverlapStepDistance={10}
        allowOverlap={false}
        snapped={true}
        values={selected}
        sliderLength={width}
        onValuesChangeFinish={onValuesChangeFinish}
        enableLabel={true}
        customLabel={SliderCustomLabel(textTransformerTimes)}
        trackStyle={{
          height: 5,
          borderRadius: 8,
        }}
        markerOffsetY={3}
        selectedStyle={{
          backgroundColor: Colors.PRIMARY,
        }}
        unselectedStyle={{
          backgroundColor: Colors.GREY,
        }}
        markerStyle={{
          height: 30,
          width: 30,
          borderRadius: 30,
          backgroundColor: Colors.SECOND_PRIMARY,
        }}
      />
    </View>
  );
};
