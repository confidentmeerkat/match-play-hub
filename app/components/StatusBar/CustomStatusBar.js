import React from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const CustomStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const styles = StyleSheet.create({
  statusBar: {
    height: getStatusBarHeight(),
  },
});

export default CustomStatusBar;
