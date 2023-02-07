import React, { useCallback } from "react";

import { Box, Button, Input, Text, VStack } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import { StyleSheet } from "react-native";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../utils/metrics";

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: hs(30),
    backgroundColor: "white",
  },
  headerText: {
    fontSize: ms(24),
    lineHeight: vs(32),
    textAlign: "center",
    marginTop: vs(24),
  },
  input: {
    fontSize: ms(15),
  },
});

export default function CreatePasswordScreen() {
  const { control, getValues, handleSubmit } = useForm();

  const handleCreatePassword = useCallback(() => {
    //TODO: integrate api for creating user
  }, []);

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
      <VStack alignItems="center" space={`${vs(45)}px`}>
        <Text style={styles.headerText} fontFamily="heading" fontStyle="italic" fontWeight="light">
          Create a Password
        </Text>

        <Controller
          control={control}
          name="password"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Input
              padding={0}
              type="password"
              variant="underlined"
              placeholder="Enter a Password"
              value={value}
              style={styles.input}
              onChange={onChange}
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
              type="password"
              variant="underlined"
              placeholder="Re-enter Password"
              style={styles.input}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </VStack>

      <Box marginTop={`${vs(85)}px`} width="full">
        <Button bgColor="primary" borderRadius="full" width="full" _text={{ fontSize: 15, lineHeight: 20 }} height={45}>
          Done
        </Button>
      </Box>
    </KeyboardAwareScrollView>
  );
}
