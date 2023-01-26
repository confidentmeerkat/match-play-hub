import React, { Component } from "react";
import {
  View,
  TouchableWithoutFeedback,
} from "react-native";

import ReactModal from "react-native-modal";

const MediaModel = ({
  onPress,
  modalVisible,
  onBackdropPress,
  onRequestClose,
  ...props
}) => (
  <ReactModal
    animationType="slide"
    transparent={true}
    isVisible={modalVisible}
    onBackdropPress={onBackdropPress}
    backdropColor={"rgba(58, 58, 58, 0.8)"}
    backdropOpacity={10}
  >
    <TouchableWithoutFeedback onPress={onPress}>
      <View {...props} style={{}}></View>
    </TouchableWithoutFeedback>
  </ReactModal>
);

export default MediaModel;
