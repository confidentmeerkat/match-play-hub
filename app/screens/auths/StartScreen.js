import { useNavigation } from "@react-navigation/native";
import { Button } from "native-base";
import { VStack } from "native-base";
import React from "react";

import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import images from "../../resources/images";
import { font_17 } from "../../utils/Globals";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  background: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  logo: {
    width: "70%",
    height: "auto",
    aspectRatio: 4 / 1,
  },
  description: {
    fontSize: font_17,
    fontWeight: "700",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    marginBottom: 40,
    borderRadius: 32,
    backgroundColor: "blue",
  },
});

const StartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={images.start_img}
        resizeMode="cover"
        imageStyle={{ opacity: 0.4 }}
      >
        <View style={styles.header}>
          <Image style={styles.logo} source={images.logo_img} resizeMode="center" />

          <Text style={styles.description}>Match with your next opponent</Text>
        </View>

        <VStack space="10" px={30}>
          <Button
            borderRadius={32}
            bgColor="primary"
            _text={{ fontSize: "md" }}
            height="12"
            onPress={() => {
              console.log("press login");
              navigation.navigate("LoginChoose");
            }}
          >
            Login
          </Button>

          <Button
            borderRadius={32}
            _text={{ color: "#104378", fontSize: "md" }}
            borderColor="white"
            borderWidth={1}
            backgroundColor="rgba(255, 255, 255, 0.4)"
            height="12"
          >
            Create an account
          </Button>
        </VStack>
      </ImageBackground>
    </View>
  );
};

export default StartScreen;
