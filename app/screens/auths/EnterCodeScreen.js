import React, { useEffect, useState } from "react";

import { Box, Input, Text, VStack } from "native-base";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../constants/Colors";
import {
  horizontalScale as hs,
  verticalScale as vs,
  moderateScale as ms,
} from "../../utils/metrics";

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: hs(30),
    paddingVertical: vs(30),
    backgroundColor: "white",
  },
  headerText: {
    fontSize: ms(24),
    lineHeight: vs(32),
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "300",
    marginTop: vs(24),
  },
  headerDescription: {
    fontSize: ms(12),
    lineHeight: vs(16),
    marginTop: vs(20),
    color: Colors.DARK_GREY,
  },
  content: {
    alignItems: "center",
  },
  input: {
    fontSize: ms(20),
    lineHeight: vs(28),
    textAlign: "center",
    fontStyle: "italic",
    borderColor: Colors.GREY,
    color: Colors.DARK_GREY,
  },
  codeFieldRoot: { marginTop: vs(40), marginHorizontal: hs(30) },
  focusCell: {
    borderColor: "#000",
  },
  bottomText: {
    fontSize: ms(14),
    lineHeight: vs(19),
    textAlign: "center",
    marginBottom: vs(35),
    color: "#787B86",
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
    <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
      <VStack style={styles.content}>
        <Text style={styles.headerText}>Enter 4-digit code</Text>

        <Text style={styles.headerDescription}>
          Your code was sent to +1 305-123-4567
        </Text>

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
              width={`${hs(50)}px`}
              marginX={`${hs(10)}px`}
              style={styles.input}
              borderColor="#D1D1D6"
              borderBottomWidth={2}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Input>
          )}
        />
      </VStack>

      <Text style={styles.bottomText}>Resend in 52 seconds</Text>
    </KeyboardAwareScrollView>
  );
};

export default EnterCodeScreen;
