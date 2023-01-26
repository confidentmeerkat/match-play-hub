import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { View } from "react-native";
import images from "../../../../resources/images";
import { TabCommonStyle } from "../../../../../assets/styles/TabCommonStyle";
import Header from "../../../../components/Header/Header";
import strings from "../../../../resources/languages/strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as globals from "../../../../utils/Globals";
import CustomTwoSegmentCoponent from "../../../../components/buttons/CustomTwoSegmentCoponent";
import { prefEnum } from "../../../../resources/constants";
import Loader from "../../../../components/loaders/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doFindMatch } from "../../../../redux/actions/AppActions";
import { doRefreshToken } from "../../../../redux/actions/AuthActions";
import { EventRegister } from "react-native-event-listeners";
import ListViewMatchScreen from "./ListViewMatchScreen";

class MatchWithListingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSelectedTab: "Find_Match",
      customStyleIndex: 0,
      currentUser: {},
      filteredmatchData: props.route.params.filteredmatchData
        ? props.route.params.filteredmatchData
        : [],
      locationInfo: props.route.params.locationInfo
        ? props.route.params.locationInfo
        : {},
      searchData: props.route.params.searchData
        ? props.route.params.searchData
        : [],
    };
  }

  async componentDidMount() {
    if (this.props.currentUser !== undefined) {
      this.setCurrentUser();
    }
    this.getApiToken();
    this.listenertwo = EventRegister.addEventListener("initializeApp", () => {
      this.setCurrentUser();
    });
    this.setState({
      locationInfo: this.state.locationInfo,
      filteredmatchData: this.state.filteredmatchData,
      searchData: this.state.searchData,
    });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listenertwo);
  }

  setCurrentUser = () => {
    this.setState({
      currentUser: this.props.currentUser,
    });
  };

  getApiToken = async () => {
    let apiToken = await AsyncStorage.getItem(prefEnum.TAG_API_TOKEN);
    globals.apiToken = apiToken;
  };

  onNavigateToProfile = () => {
    this.displayProfilePicker();
    this.props.navigation.navigate("EditProfile",{isFrom:''});
  };

  gotoMatchTab = (selectedTab) => {
    this.setState({ isSelectedTab: selectedTab });
  };

  gotoCreateMatch = () => {
    this.props.navigation.navigate("CreateMatch");
  };

  handleCustomIndexSelect = (index) => {
    this.setState({
      ...this.state,
      customStyleIndex: index,
    });
  };

  render() {
    const { isSelectedTab, filteredmatchData, searchData, locationInfo } =
      this.state;

    return (
      <View style={[TabCommonStyle.container]}>
        <Header isHideBack props={this.props} />
        <View style={TabCommonStyle.container}>
          <View style={{ marginHorizontal: wp(5), marginTop: -hp(2) }}>
            <CustomTwoSegmentCoponent
              segmentOneTitle={strings.findMatch}
              segmentOneImage={images.find_img}
              segmentTwoTitle={strings.createMatch}
              segmentTwoImage={images.add_img}
              isSelectedTab={isSelectedTab}
              onPressSegmentOne={() => this.gotoMatchTab("Find_Match")}
              onPressSegmentTwo={() => this.gotoCreateMatch("Create_Match")}
            />
          </View>

          {isSelectedTab == "Find_Match" ? (
            <ListViewMatchScreen
              props={this.props}
              filteredmatchData={filteredmatchData}
              locationInfo={locationInfo}
              searchData={searchData}
            />
          ) : null}
        </View>
        {this.props.isBusyFindMatch ? <Loader /> : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isBusyFindMatch: state.app.isBusyFindMatch,
    responseFindMatchdata: state.app.responseFindMatchdata,
    responseRefreshTokendata: state.auth.responseRefreshTokendata,
    currentUser: state.auth.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        doRefreshToken,
        doFindMatch,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchWithListingScreen);
