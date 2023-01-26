import React from "react";
import {
  InputToolbar,
  Actions,
  Composer,
  Send,
} from "react-native-gifted-chat";
import FastImage from "react-native-fast-image";
import font_type from "../../resources/fonts";
import * as globals from "../../utils/Globals";
import Colors from "../../constants/Colors";
import images from "../../resources/images";

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: Colors.WHITE,
      marginHorizontal: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 2,
        height: 12,
      },

      shadowOpacity: 0.58,
      shadowRadius: 16,
      elevation: 24,
      paddingTop: 6,
      borderRadius: 8,
    }}
    primaryStyle={{ alignItems: "center" }}
    // accessoryStyle={{ height: props.accessoryStyle.height ? 0 : 0 }}
  />
);

export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      // marginRight: -2,
      marginBottom: 6,
    }}
    icon={() => (
      <FastImage
        style={{ width: 22, height: 22, alignSelf: "center" }}
        source={images.round_plus_img}
        resizeMode={FastImage.resizeMode.contain}
      />
    )}
    options={{
      "Choose From Library": () => {
        console.log("Choose From Library");
      },
      Cancel: () => {
        console.log("Cancel");
      },
    }}
    optionTintColor={Colors.PRIMARY}
  />
);

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: Colors.BLACK,
      backgroundColor: Colors.WHITE,
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
      fontFamily: font_type.FontRegular,
      fontSize: globals.font_14,
    }}
  />
);

export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
      backgroundColor: Colors.PRIMARY,
      marginBottom: 5,
      marginRight: 5,
      borderRadius: 5,
    }}
  >
    <FastImage
      style={{ width: 22, height: 22, tintColor: Colors.WHITE }}
      source={images.share_img}
      resizeMode={FastImage.resizeMode.contain}
    />
  </Send>
);
