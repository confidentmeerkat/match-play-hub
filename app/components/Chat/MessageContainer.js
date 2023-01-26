import React from "react";
import { View, Text } from "react-native";
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  Time,
  MessageText,
} from "react-native-gifted-chat";
import font_type from "../../resources/fonts";
import * as globals from "../../utils/Globals";
import Colors from "../../constants/Colors";

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 3, borderColor: "red" }, right: {} }}
    imageStyle={{ left: { borderWidth: 3, borderColor: "blue" }, right: {} }}
  />
);

export const renderBubble = (props) => (
  <Bubble
    {...props}
    // renderTicks={() => <Text>Ticks</Text>}

    containerStyle={{
      left: {
        color: Colors.BLACK,
        fontSize: globals.normalize(12),
        fontFamily: font_type.FontRegular,
        borderTopLeftRadius: 15,
        marginBottom: 10,
      },
      right: {
        color: Colors.WHITE,
        fontSize: globals.normalize(12),
        fontFamily: font_type.FontRegular,
        borderTopRightRadius: 15,
        marginBottom: 10,
      },
    }}
    textStyle={{
      right: {
        color: Colors.WHITE,
        fontSize: globals.normalize(12),
        fontFamily: font_type.FontRegular,
        padding: 5,
        borderTopRightRadius: 15,
      },
      left: {
        color: Colors.BLACK,
        fontSize: globals.normalize(12),
        fontFamily: font_type.FontRegular,
        borderTopLeftRadius: 15,
        padding: 5,
      },
    }}
    // wrapperStyle={{
    //   left: {
    //     color: Colors.BLACK,
    //     backgroundColor: Colors.LITE_GREY,
    //     marginBottom: 10,
    //     paddingVertical: 5,
    //     borderTopLeftRadius: 15,
    //   },
    //   right: {
    //     color: Colors.WHITE,
    //     backgroundColor: Colors.PRIMARY,
    //     marginBottom: 10,
    //     paddingVertical: 5,
    //     borderTopRightRadius: 15,
    //   },
    // }}
    // containerToNextStyle={{
    //   left: {
    //     color: Colors.BLACK,
    //     fontSize: globals.normalize(12),
    //     fontFamily: font_type.FontRegular,
    //     borderTopLeftRadius: 15,
    //   },
    //   right: {
    //     color: Colors.WHITE,
    //     fontSize: globals.normalize(12),
    //     fontFamily: font_type.FontRegular,
    //     borderTopRightRadius: 15,
    //   },
    // }}
    // containerToPreviousStyle={{
    //   left: {
    //     color: Colors.BLACK,
    //     fontSize: globals.normalize(12),
    //     fontFamily: font_type.FontRegular,
    //     borderTopLeftRadius: 15,
    //   },
    //   right: {
    //     color: Colors.WHITE,
    //     fontSize: globals.normalize(12),
    //     fontFamily: font_type.FontRegular,
    //     borderTopRightRadius: 15,
    //   },
    // }}
  />
);
export const renderTime = (props) => {
  return (
    <Time
      {...props}
      renderTime={() => <Text>gkgl</Text>}
      timeTextStyle={{
        right: {
          color: Colors.WHITE,
          fontSize: globals.normalize(10),
          fontFamily: font_type.FontRegular,
        },
        left: {
          color: Colors.BLACK,
          fontSize: globals.normalize(10),
          fontFamily: font_type.FontRegular,
        },
      }}
    />
  );
};

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{
      alignSelf: "center",
      justifyContent: "flex-start",
    }}
    textStyle={{
      color: Colors.GREY,
      fontSize: globals.normalize(12),
      fontFamily: font_type.FontRegular,backgroundColor:'red'
    }}
  />
);

export const renderMessage = (props) => (
  <Message {...props} renderDay={() => <Text>Date</Text>} />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: Colors.GREY },
      right: { backgroundColor: Colors.PRIMARY },
    }}
    textStyle={{
      left: { color: Colors.BLACK },
      right: { color: Colors.WHITE },
    }}
    linkStyle={{
      left: { color: Colors.BLACK },
      right: { color: Colors.WHITE },
    }}
    customTextStyle={{
      lineHeight: 24,
      fontFamily: font_type.FontRegular,
      fontSize: globals.font_14,
    }}
  />
);

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: "center" }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);
