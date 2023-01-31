import React from "react";
import { Box, Button, HStack, Icon, IconButton, Image, Input, VStack } from "native-base";
import { useState } from "react";

import CountryPicker from "react-native-country-picker-modal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useMaskedInputProps } from "react-native-mask-input";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import images from "../../resources/images";

const CreateAccountScreen = () => {
  const { control } = useForm();

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
        <Image source={images.logo_img} resizeMode="center" />

        <VStack width="full" flex={1}>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Input
                my={2}
                fontSize="lg"
                variant="underlined"
                placeholder="Enter Username"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            rules={{ validate: { matchesPassword: (value) => value === getValues("password") } }}
            render={({ field: { value, onChange } }) => (
              <Input
                my={2}
                fontSize="lg"
                variant="underlined"
                placeholder="Enter Email"
                value={value}
                onChange={onChange}
              />
            )}
          />

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
            <Input my={2} flex={1} variant="unstyled" fontSize="lg" textAlign="center" {...maskedInputProps} />
            <IconButton
              icon={<Icon as={MaterialIcons} size="xs" name="close" />}
              onPress={() => setPhoneNumber("")}
            ></IconButton>
          </HStack>
        </VStack>

        <Button
          bgColor="primary"
          paddingX={8}
          mb={12}
          borderRadius="3xl"
          height="12"
          onPress={onSendCode}
          width="full"
        >
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateAccountScreen;
