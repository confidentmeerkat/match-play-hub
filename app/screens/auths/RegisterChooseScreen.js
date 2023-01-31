import React from "react";
import { VStack, Text, Button, Box, HStack, Image } from "native-base";
import images from "../../resources/images";
import { useNavigation } from "@react-navigation/native";

const RegisterChooseScreen = () => {
  const navigation = useNavigation();

  return (
    <Box flex={1} bgColor="white" flexDir="column" justifyContent="space-between">
      <VStack flex={1} alignItems="center" p={10} space={6}>
        <Text italic fontSize="2xl" fontWeight="bold" color="#232832">
          Sign up to play a Match
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
          onPress={() => navigation.navigate("CreateAccount")}
        >
          <Text width="full">with phone or email</Text>
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
          Sign up with google
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
          Sign up with facebook
        </Button>
      </VStack>

      <HStack justifyContent="center" mb="32">
        <Text color="gray.500">Sign in the representative to agree to the</Text>
        <Text color="coolGray.800"> user agreement</Text>
      </HStack>
    </Box>
  );
};

export default RegisterChooseScreen;
