import React from "react";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { NativeBaseProvider } from "native-base";
import configureStore from "./app/redux/stores/configureStore";
import theme from "./app/theme";

const RNRedux = () => (
  <Provider store={configureStore()}>
    <NativeBaseProvider theme={theme}>
      <App />
    </NativeBaseProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
