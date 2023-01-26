import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { View } from "react-native";
import { TabCommonStyle } from "../../../../assets/styles/TabCommonStyle";
import strings from "../../../resources/languages/strings";
import CustomTwoSegmentCoponent from "../../../components/buttons/CustomTwoSegmentCoponent";
import images from "../../../resources/images";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import FindPlayerScreen from "./FindPlayerScreen";
import MyPlayerScreen from "./MyPlayerScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
class PlayTabScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSelectedTab:
        props.route.params.isfrom == "manageRequest"
          ? "My_Player"
          : "Find_Player",
    };
  }

  componentDidMount() {}

  gotoPlayerTab = (selectedTab) => {
    this.setState({ isSelectedTab: selectedTab });
  };

  render() {
    const { isSelectedTab } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        {/* <Header props={this.props} /> */}

        <View style={[TabStyle.container, { marginTop: -hp(1) }]}>
          <CustomTwoSegmentCoponent
            segmentOneTitle={strings.myPlayer}
            segmentOneImage={images.allUsers_img}
            segmentTwoTitle={strings.findPlayer}
            segmentTwoImage={images.adduser_img}
            isSelectedTab={isSelectedTab}
            onPressSegmentOne={() => this.gotoPlayerTab("My_Player")}
            onPressSegmentTwo={() => this.gotoPlayerTab("Find_Player")}
          />
          {isSelectedTab == "Find_Player" ? (
            <FindPlayerScreen props={this.props} />
          ) : (
            <MyPlayerScreen props={this.props} />
          )}
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayTabScreen);
