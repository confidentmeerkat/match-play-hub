import React, {useEffect} from "react";
import { VStack, Text, Button, HStack, Image } from "native-base";
import images from "../../resources/images";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Platform } from "react-native";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../utils/metrics";
import { AccessToken, GraphRequest, LoginManager } from "react-native-fbsdk-next";
import messaging from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux"
import  { doFBLogin, doGetUser } from "../../redux/actions/AuthActions"
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

  useEffect(() => {
    const { status_code, token, success, error, message } = responseLogin || {};

    if(status_code === 200 && success) {
      AsyncStorage.setItem(prefEnum.TAG_API_TOKEN, token);
      globals.access_token = token;
      dispatch(doGetUser());
    }
  }, [responseLogin]);

  useEffect(() => {
      const { user, success, message, status_code } = responseUserdata || {};

      if(user) {
        AsyncStorage.setItem(prefEnum.TAG_USER, JSON.stringify(user));
        navigation.navigate('Home', {from: 'login'})
      }
  }, [responseUserdata]);

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);

      if (result.isCancelled) {
        alert("Login Cancelled" + JSON.stringify(result));
      } else {
        alert("Login Success", result.toString());
        const { accessToken } = await AccessToken.getCurrentAccessToken();
        let fcmToken = await messaging().getToken();
        // postRequest(FBLOGIN, {fbToken: accessToken, device_id: DeviceInfo.getDeviceId(), device_type: Platform.OS, device_token: fcmToken})
        dispatch(doFBLogin({fbToken: accessToken, device_id: DeviceInfo.getDeviceId(), device_type: Platform.OS, device_token: fcmToken}))
      }
    } catch (error) {
      console.log("Facebook login failed");
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
            onPress={handleFacebookLogin}
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
