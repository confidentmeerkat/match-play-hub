import { extendTheme } from "native-base";

const colors = {
  primary: "#0D6EFD",
};

const config = {
  colors,
  fontConfig: {
    OpenSans: {
      100: {
        normal: "OpenSans-LightRegular",
        italic: "OpenSans-LightItalic",
      },
      200: {
        normal: "OpenSans-LightRegular",
        italic: "OpenSans-LightItalic",
      },
      300: {
        normal: "OpenSans-LightRegular",
        italic: "OpenSans-LightItalic",
      },
      400: {
        normal: "OpenSans-Regular",
        italic: "OpenSans-Italic",
      },
      500: {
        normal: "OpenSans-Medium",
        italic: "OpenSans-MediumItalic",
      },
      600: {
        normal: "OpenSans-SemiBold",
        italic: "OpenSans-SemiBoldItalic",
      },
      700: {
        normal: "OpenSans-Bold",
        italic: "OpenSans-BoldItalic",
      },
    },
  },
  fonts: {
    heading: "OpenSans",
    body: "OpenSans",
    mono: "OpenSans",
  },
};

const theme = extendTheme(config);
export default theme;
