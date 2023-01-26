import { connect } from "react-redux";
import React, { PureComponent } from "react";
import { Text,  Linking, View, TouchableOpacity } from "react-native";
import { ProfileStyle } from "../../../../assets/styles/ProfileStyle";
import Header from "../../../components/Header/Header";
import strings from "../../../resources/languages/strings";
import { TabStyle } from "../../../../assets/styles/TabStyle";
import Colors from "../../../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
class HelpCenterScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <View style={[ProfileStyle.container]}>
        <Header isFrom={"HelpCenter"} isHideBack props={this.props} headerText={"Help Center"} />
        <View style={TabStyle.marginfromallside}>
          <Text style={[TabStyle.deleteAccText]}>{strings.helpcenter}</Text>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:admin@matchplayhub.com")}
          style={[TabStyle.marginfromallside, { marginVertical: hp(1) }]}
        >
          <Text
            style={[
              TabStyle.deleteAccText,
              { fontWeight: "bold", color: Colors.PRIMARY },
            ]}
          >
            {strings.adminemail}
          </Text>
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(HelpCenterScreen);
