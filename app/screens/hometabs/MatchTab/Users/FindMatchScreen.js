import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { View } from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Header from "../../../../components/Header/Header";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { ProfileStyle } from "../../../../../assets/styles/ProfileStyle";
import MapViewMatchScreen from "./MapViewMatchScreen";
import ListViewMatchScreen from "./ListViewMatchScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
class FindMatchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchTabs: ["List View", "Map View"],
      customStyleIndex: 0,
    };
  }

  componentDidMount() {}

  handleCustomIndexSelect = (index) => {
    this.setState({
      ...this.state,
      customStyleIndex: index,
    });
  };

  render() {
    const { matchTabs, customStyleIndex } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />

        <View style={[ProfileStyle.beforetabview, { marginTop: -hp(1) }]}>
          <SegmentedControlTab
            values={matchTabs}
            selectedIndex={customStyleIndex}
            tabStyle={ProfileStyle.tabStyle}
            activeTabStyle={ProfileStyle.activeTabStyle}
            onTabPress={()=>this.handleCustomIndexSelect()}
            tabTextStyle={ProfileStyle.tabfontsize}
            activeTabTextStyle={ProfileStyle.activefontsize}
          />
        </View>
        {customStyleIndex == 0 ? (
          <ListViewMatchScreen props={this.props} />
        ) : null}
        {customStyleIndex == 1 ? (
          <MapViewMatchScreen props={this.props} />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(FindMatchScreen);
