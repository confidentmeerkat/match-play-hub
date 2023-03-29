import React, { useEffect } from "react";
import { VStack, Text, Button, HStack, Image } from "native-base";
import images from "../../resources/images";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Platform } from "react-native";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../utils/metrics";
import { AccessToken, GraphRequest, LoginManager } from "react-native-fbsdk-next";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import messaging from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import { doFBLogin, doGetUser, doGoogleLogin, doRefreshToken } from "../../redux/actions/AuthActions";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { prefEnum } from "../../resources/constants";
import * as globals from "../../utils/Globals";

const styles = StyleSheet.create({
  headerText: {
    fontSize: ms(24),
    lineHeight: vs(32),
    textAlign: "center",
    marginTop: vs(24),
    color: "#232832",
  },
  headerDescription: {
    // fontFamily: "OpenSans",
    fontSize: ms(12),
    lineHeight: vs(20),
    textAlign: "center",
    marginTop: vs(21),
    color: "#787B86",
  },
});

const LoginChooseScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const responseLogin = useSelector((store) => store.auth.responseLogin);
  const responseUserdata = useSelector((store) => store.auth.responseUserdata);

  const clearUserData = async () => {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === "android") {
        AsyncStorage.clear();
      }
      if (Platform.OS === "ios") {
        AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
  };

  useEffect(() => {
    clearUserData();
  }, [clearUserData]);

  useEffect(() => {
    const { status_code, token, success, error, message } = responseLogin || {};

    if (status_code === 200 && success && !globals.access_token) {
      AsyncStorage.setItem(prefEnum.TAG_API_TOKEN, token);
      globals.access_token = token;
      dispatch(doGetUser());
    }
  }, [responseLogin]);

  useEffect(() => {
    const { user, success, message, status_code } = responseUserdata || {};
    console.log("responseUserdata :", responseUserdata);

    if (status_code == 200 && success == true && globals.access_token) {
      AsyncStorage.setItem(prefEnum.TAG_USER, JSON.stringify(user));
      navigation.navigate("Home", { from: "login" });
    } else if (success == false) {
      if (status_code == 401 && message == "Token has expired") {
        dispatch(doRefreshToken());
      } else if (status_code !== undefined && status_code === 402) {
        showErrorMessage(message);
        if (Platform.OS === "android") {
          AsyncStorage.clear();
        }
        if (Platform.OS === "ios") {
          AsyncStorage.multiRemove(asyncStorageKeys);
        }
        navigation.navigate("AuthLoading");
      } else if (status_code == 500) {
        showErrorMessage(strings.somethingWrong);
      } else {
      }
    }
  }, [responseUserdata]);

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);

      if (result.isCancelled) {
        // alert("Login Cancelled" + JSON.stringify(result));
      } else {
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
        androidClientId: "536089685086-e89m4sdcq4k7jcb555vjfv71esb6nt14.apps.googleusercontent.com",
        iosClientId: "536089685086-l82peevh3u6cksfdpc55k9u386etf33h.apps.googleusercontent.com",
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
        <Text fontFamily="heading" fontStyle="italic" fontWeight="light" style={styles.headerText}>
          More exciting after logging in
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
            onPress={() => navigation.navigate("Login")}
          >
            with phone, Email or Username
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
            Login with google
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
            onPress={handleFacebookLogin}
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
            Login with facebook
          </Button>
        </VStack>
      </VStack>

      <HStack justifyContent="center" mb={`${hs(102)}px`}>
        <Text color="gray.500" textAlign="center" fontSize={ms(12)} lineHeight={vs(20)}>
          Sign in the representative to agree to
          <Text color="coolGray.800"> the user agreement</Text>
        </Text>
      </HStack>
    </VStack>
  );
};

export default LoginChooseScreen;
