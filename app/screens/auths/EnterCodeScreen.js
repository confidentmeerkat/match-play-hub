import React, { useEffect, useState } from "react";

import { Box, Input, Text, VStack } from "native-base";

import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 40, gap: 12 },
  focusCell: {
    borderColor: "#000",
  },
});

const EnterCodeScreen = ({ route: { phone } }) => {
  const navigation = useNavigation();

  const [code, setCode] = useState("");

  const ref = useBlurOnFulfill({ code, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setCode,
  });

  useEffect(() => {
    ref.current.focus();
  }, []);

  useEffect(() => {
    if (code.length === 4) {
      // TODO: validate code
      console.log("validating code");

      navigation.navigate("CreatePassword");
    }
  }, [code]);

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
            Enter 4-digit code
          </Text>

          <Text mt={6}> Your code was sent to {phone}</Text>

          <Box>
            <CodeField
              ref={ref}
              {...props}
              value={code}
              rootStyle={styles.codeFieldRoot}
              onChangeText={setCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              cellCount={4}
              renderCell={({ index, symbol, isFocused }) => (
                <Input
                  key={index}
                  variant="underlined"
                  onLayout={getCellOnLayoutHandler}
                  height="10"
                  width="20"
                  mx={1}
                  fontSize="xl"
                  textAlign="center"
                  fontStyle="italic"
                  borderColor="#D1D1D8"
                  borderBottomWidth={2}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Input>
              )}
            />
          </Box>
        </VStack>

        <Text>Resend in 52 seconds</Text>
      </KeyboardAwareScrollView>
    </VStack>
  );
};

export default EnterCodeScreen;
