import React from "react";
import { Box, Button, HStack, Icon, IconButton, Input, VStack } from "native-base";
import { useState } from "react";

import CountryPicker from "react-native-country-picker-modal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useMaskedInputProps } from "react-native-mask-input";
import { useNavigation } from "@react-navigation/native";

const SendCodeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("+1");

  const navigation = useNavigation();

  const maskedInputProps = useMaskedInputProps({
    value: phoneNumber,
    onChangeText: (v) => setPhoneNumber(v),
    mask: [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
    placeholderFillCharacter: "",
  });

  const onSendCode = () => {
    //TODO: send code to the phone number

    navigation.navigate("EnterCode");
  };

  return (
    <Box flex={1} bgColor="white">
      <VStack justifyContent="space-around" m={8} flex={1} alignItems="center">
        <HStack borderBottomWidth={1} borderBottomColor="gray.300" justifyContent="space-between" alignItems="center">
          <CountryPicker
            countryCode={countryCode}
            withFilter={true}
            withFlag={true}
            withCallingCode={true}
            withAlphaFilter={true}
            withCallingCodeButton={true}
            withEmoji={false}
            // containerButtonStyle={$countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />
          <Input flex={1} variant="unstyled" fontSize="lg" textAlign="center" {...maskedInputProps} />
          <IconButton
            icon={<Icon as={MaterialIcons} size="xs" name="close" />}
            onPress={() => setPhoneNumber("")}
          ></IconButton>
        </HStack>

        <Button bgColor="primary" paddingX={8} height={12} borderRadius="3xl" onPress={onSendCode} width="full">
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default SendCodeScreen;
