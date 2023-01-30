import React, { useCallback } from "react";

import { Button, Input, Text, VStack } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";

export default function CreatePasswordScreen() {
  const { control, getValues, handleSubmit } = useForm();

  const handleCreatePassword = useCallback(() => {
    //TODO: integrate api for creating user
  }, []);

  return (
    <VStack flex={1} p={8} bgColor="white">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <VStack flex={1} alignItems="center">
          <Text italic fontSize="2xl" fontWeight="light">
            Create a Password
          </Text>

          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Input mt={10} px={4} variant="underlined" placeholder="Enter a Password" value={value} onChange={onChange} />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            rules={{ validate: { matchesPassword: (value) => value === getValues("password") } }}
            render={({ field: { value, onChange } }) => (
              <Input mt={10} px={4} variant="underlined" placeholder="Re-enter Password" value={value} onChange={onChange} />
            )}
          />
        </VStack>

        <Button
          bgColor="primary"
          width="full"
          borderRadius="3xl"
          _text={{ fontSize: "md" }}
          height="12"
          onPress={handleSubmit(handleCreatePassword)}
        >
          Done
        </Button>
      </KeyboardAwareScrollView>
    </VStack>
  );
}
