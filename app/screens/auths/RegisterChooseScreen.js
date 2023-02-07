import React from "react";
import { VStack, Text, Button, HStack, Image } from "native-base";
import images from "../../resources/images";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../utils/metrics";

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerText: {
    fontSize: ms(24),
    lineHeight: vs(32),
    textAlign: "center",
    marginTop: vs(24),
    color: "#232832",
  },
  headerDescription: {
    fontSize: ms(12),
    lineHeight: vs(20),
    textAlign: "center",
    marginTop: vs(21),
    color: "#787B86",
  },
});

const RegisterChooseScreen = () => {
  const navigation = useNavigation();

  return (
    <VStack flex={1} bgColor="white" justifyContent="space-between">
      <VStack p={hs(30)}>
        <Text fontFamily="heading" fontStyle="italic" fontWeight="bold" style={styles.headerText}>
          Sign up to play a Match
        </Text>

        <Text style={styles.headerDescription}>
          If you haven’t registered yet, and your account will be automatically registered
        </Text>

        <VStack mt={`${vs(27.5)}px`} space={`${vs(25)}px`}>
          <Button
            height={45}
            borderRadius="full"
            width="full"
            justifyContent="flex-start"
            borderWidth={1}
            borderColor="dark.600"
            _text={{
              color: "coolGray.800",
              fontSize: 15,
              lineHeight: 20,
              marginLeft: `${hs(35)}px`,
            }}
            startIcon={
              <Image
                source={images.phone_img}
                resizeMode="center"
                style={{
                  width: hs(20),
                  aspectRatio: 1,
                }}
                alt="password"
              />
            }
            onPress={() => navigation.navigate("CreateAccount")}
          >
            with phone or Email
          </Button>

          <Button
            height={45}
            borderRadius="full"
            width="full"
            justifyContent="flex-start"
            borderWidth={1}
            borderColor="dark.600"
            _text={{
              color: "coolGray.800",
              fontSize: 15,
              lineHeight: 20,
              marginLeft: `${hs(35)}px`,
            }}
            startIcon={
              <Image
                source={images.google_img}
                alt="google"
                resizeMode="center"
                style={{
                  width: hs(20),
                  aspectRatio: 1,
                }}
              />
            }
          >
            Sign up with google
          </Button>

          <Button
            height={45}
            borderRadius="full"
            width="full"
            justifyContent="flex-start"
            borderWidth={1}
            borderColor="dark.600"
            _text={{
              color: "coolGray.800",
              fontSize: 15,
              lineHeight: 20,
              marginLeft: `${hs(35)}px`,
            }}
            startIcon={
              <Image
                alt="facebook"
                source={images.facebook_img}
                resizeMode="center"
                style={{
                  width: hs(20),
                  aspectRatio: 1,
                }}
              />
            }
          >
            Sign up with facebook
          </Button>
        </VStack>
      </VStack>

      <HStack justifyContent="center" mb={`${hs(102)}px`}>
        <Text color="gray.500" textAlign="center" fontSize={ms(12)} lineHeight={vs(20)}>
          Sign in the representative to agree to the
          <Text color="coolGray.800"> the user agreement</Text>
        </Text>
      </HStack>
    </VStack>
  );
};

export default RegisterChooseScreen;
