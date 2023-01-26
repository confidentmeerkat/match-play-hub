import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Platform, View, BackHandler } from "react-native";
import { ProfileStyle } from "../../../assets/styles/ProfileStyle";
import { WebView } from "react-native-webview";
import Header from "../../components/Header/Header";
import { privacyURL } from "../../networks/APiKeys";

class TermAndConditionScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (Platform.OS == "android") {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS == "android") {
      this.backHandler.remove();
    }
  }

  backAction = () => {
    this.gotoBackScreen();
    return true;
  };

  gotoBackScreen() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={[ProfileStyle.container]}>
        <Header isHideBack props={this.props} headerText={"Term And Condition"}/>
        <WebView
          scalesPageToFit
          style={{ width: "100%", height: "100%" }}
          source={{
            uri: privacyURL,
          }}erfe
          javaScriptEnabled={true}
          renderLoading={this.ActivityIndicatorLoadingView}
          startInLoadingState={true}
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
)(TermAndConditionScreen);
