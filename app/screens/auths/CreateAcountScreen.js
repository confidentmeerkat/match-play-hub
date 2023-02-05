import React from "react";
import { Box, Button, Input, VStack } from "native-base";
import { useState } from "react";
import { useMaskedInputProps } from "react-native-mask-input";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { StyleSheet } from "react-native";
import {
  horizontalScale as hs,
  verticalScale as vs,
  moderateScale as ms,
} from "../../utils/metrics";

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: hs(30),
    backgroundColor: "white",
  },
  input: {
    fontSize: ms(15),
    padding: 0,
  },
});

const CreateAccountScreen = () => {
  const { control } = useForm();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("+1");

  const navigation = useNavigation();

  const maskedInputProps = useMaskedInputProps({
    value: phoneNumber,
    onChangeText: (v) => setPhoneNumber(v),
    mask: [
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
    placeholderFillCharacter: "",
  });

  const onSendCode = () => {
    //TODO: send code to the phone number

    navigation.navigate("EnterCode");
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
      <VStack width="full" alignItems="center">
        <VStack
          alignItems="center"
          marginTop={`${vs(120)}px`}
          space={`${vs(35)}px`}
        >
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Input
                padding={0}
                variant="underlined"
                placeholder="Enter Username"
                value={value}
                onChange={onChange}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            rules={{
              validate: {
                matchesPassword: (value) => value === getValues("password"),
              },
            }}
            render={({ field: { value, onChange } }) => (
              <Input
                padding={0}
                variant="underlined"
                placeholder="Enter Email"
                value={value}
                onChange={onChange}
                style={styles.input}
              />
            )}
          />

          <Input
            padding={0}
            variant="underlined"
            {...maskedInputProps}
            style={styles.input}
            placeholder="Enter Phone number"
          />
        </VStack>

        <Box marginTop={`${vs(60)}px`} width="full">
          <Button
            bgColor="primary"
            borderRadius="full"
            onPress={onSendCode}
            width="full"
            _text={{ fontSize: ms(15), lineHeight: vs(20) }}
          >
            Next
          </Button>
        </Box>
      </VStack>
    </KeyboardAwareScrollView>
  );
};

export default CreateAccountScreen;
