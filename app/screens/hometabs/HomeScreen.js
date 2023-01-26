import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import HomeStack from ".";

class HomeScreen extends PureComponent {
  render() {
    return (
      <View style={styles.flexOne}>
        <HomeStack />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
});

export default HomeScreen;
