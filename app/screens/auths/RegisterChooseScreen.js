import React from "react";
import { VStack, Text, Button, HStack, Image } from "native-base";
import images from "../../resources/images";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../utils/metrics";

import { StyleSheet, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { doFBLogin, doGoogleLogin } from "../../redux/actions/AuthActions";
import messaging from "@react-native-firebase/messaging";
import DeviceInfo from "react-native-device-info";
import { LoginManager } from "react-native-fbsdk-next";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
  const dispatch = useDispatch();

  const handleFacebookRegister = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);

      if (result.isCancelled) {
        alert("Login Cancelled" + JSON.stringify(result));
      } else {
        alert("Login Success", result.toString());
        const { accessToken } = await AccessToken.getCurrentAccessToken();
        let fcmToken = await messaging().getToken();
        dispatch(
          doFBLogin({
            fbToken: accessToken,
            device_id: DeviceInfo.getDeviceId(),
            device_type: Platform.OS,
            device_token: fcmToken,
          })
        );
      }
    } catch (error) {
      console.log("Facebook login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      GoogleSignin.configure({
        androidClientId: "536089685086-7ba4fjmthaplj4gsgqtrgnckfv8s58va.apps.googleusercontent.com",
        iosClientId: "IOS_CLIENT_ID",
      });

      const hasPlayService = await GoogleSignin.hasPlayServices();

      if (hasPlayService) {
        await GoogleSignin.signIn();
        const { accessToken } = await GoogleSignin.getTokens();
        let fcmToken = await messaging().getToken();

        dispatch(
          doGoogleLogin({
            googleToken: accessToken,
            device_id: DeviceInfo.getDeviceId(),
            device_type: Platform.OS,
            device_token: fcmToken,
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

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
            onPress={handleGoogleLogin}
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
            onPress={handleFacebookRegister}
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
