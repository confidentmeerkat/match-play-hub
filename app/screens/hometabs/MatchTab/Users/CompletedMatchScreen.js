import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Header from "../../../../components/Header/Header";
import strings from "../../../../resources/languages/strings";
import { TabStyle } from "../../../../../assets/styles/TabStyle";
import images from "../../../../resources/images";
import MatchDetailComponent from "../../../../components/RenderFlatlistComponent/MatchDetailComponent";
import CustomOnebuttonComponent from "../../../../components/buttons/CustomOnebuttonComponent";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
class CompletedMatchScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmedPlayersList: [],
      matchDetail: props.route.params.matchDetail,
    };
  }

  async componentDidMount() {
    await this.updateMatchDetails();
  }

  updateMatchDetails = () => {
    const { matchDetail } = this.state;
    this.setState({
      confirmedPlayersList: matchDetail.confirmed_player,
    });
  };

  onClickRematch = () => {
    this.props.navigation.navigate("ReMatch", {
      matchDetail: this.state.matchDetail,
    });
  };

  gotoMapScreen = () => {
    this.props.navigation.navigate("MapView", {
      matchDetail: this.state.matchDetail,
    });
  };

  render() {
    const { confirmedPlayersList, matchDetail } = this.state;
    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={[TabStyle.marginfromallside, { marginTop: hp(1) }]}>
          <CustomOnebuttonComponent
            segmentOneTitle={strings.rematch}
            segmentOneImage={images.refresh_img}
            onPressSegmentOne={() => this.onClickRematch()}
          />
        </View>
        <View style={TabStyle.completedView}>
          <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
            {strings.completed}
          </Text>
        </View>
        <MatchDetailComponent
          date={matchDetail.match_date ? matchDetail.match_date : ""}
          month={matchDetail.match_month ? matchDetail.match_month : ""}
          matchName={matchDetail.sport ? matchDetail.sport : ""}
          matchLevel={matchDetail.level ? matchDetail.level : ""}
          datetime={matchDetail.match_time ? matchDetail.match_time : ""}
          day={matchDetail.match_day ? matchDetail.match_day : ""}
          location={matchDetail.location ? matchDetail.location : ""}
          firstheadingtitle={strings.players}
          firstheadingdata={confirmedPlayersList}
          gotoMapScreen={() => this.gotoMapScreen()}
        />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedMatchScreen);
