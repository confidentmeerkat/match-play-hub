import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import HomeTabItem from "./HomeTabItem";
import { CommonActions } from "@react-navigation/native";

class HomeTab extends PureComponent {
  onTabPress = (route) => {
    // this.props.navigation.navigate(route, { from: "HomeTab", isEdit: false });
    let resetAction = CommonActions.reset({
      index: 0,
      key: null,
      routes: [{ name: route }],
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    const { routes, index: activeRouteIndex } = this.props.state;
    return (
      <View style={styles.container}>
        {routes.map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;

          return (
            <TouchableOpacity
              key={routeIndex}
              onPress={this.onTabPress.bind(this, route.name)}
              style={styles.flexOne}
            >
              <HomeTabItem
                isRouteActive={isRouteActive}
                routeIndex={routeIndex}
                route={route.name}
                activeRouteIndex={activeRouteIndex}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    flexDirection: "row",
  },
  flexOne: { flex: 1 },
});

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);
