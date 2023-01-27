import React from "react";
import { VStack, Text, Button, Box, HStack, Image } from "native-base";
import images from "../../resources/images";

const LoginChooseScreen = () => {
  return (
    <Box flex={1} bgColor="white" flexDir="column" justifyContent="space-between">
      <VStack flex={1} alignItems="center" p={10} space={6}>
        <Text italic fontSize="2xl" fontWeight={300} color="#232832">
          More exciting after logging in
        </Text>

        <Text textAlign="center" fontSize="xs" color="#787B86">
          If you haven’t registered yet, and your account will be automatically registered
        </Text>

        <Button
          borderRadius={32}
          borderWidth={1}
          borderColor="dark.600"
          height={12}
          width="full"
          _stack={{ flex: 1, justifyContent: "center" }}
          startIcon={
            <Image
              source={images.phone_img}
              resizeMode="contain"
              position="absolute"
              left="0"
              size="xs"
              height="80%"
              alt="password"
            />
          }
        >
          <Text width="full">with phone or username</Text>
        </Button>

        <Button
          borderRadius={32}
          borderWidth={1}
          borderColor="dark.600"
          height={12}
          width="full"
          _stack={{ flex: 1, justifyContent: "center" }}
          _text={{ color: "coolGray.800" }}
          startIcon={
            <Image
              source={images.google_img}
              alt="google"
              resizeMode="contain"
              position="absolute"
              left="0"
              size="xs"
              height="80%"
            />
          }
        >
          Login with google
        </Button>

        <Button
          borderRadius={32}
          borderWidth={1}
          borderColor="dark.600"
          height={12}
          width="full"
          _stack={{ flex: 1, justifyContent: "center" }}
          _text={{ color: "coolGray.800" }}
          startIcon={
            <Image
              alt="facebook"
              source={images.facebook_img}
              resizeMode="contain"
              position="absolute"
              left="0"
              size="xs"
              height="80%"
            />
          }
        >
          Login with facebook
        </Button>
      </VStack>

      <HStack justifyContent="center" mb="32">
        <Text color="gray.500">Sign in the representative to agree to the</Text>
        <Text color="coolGray.800"> user agreement</Text>
      </HStack>
    </Box>
  );
};

export default LoginChooseScreen;
