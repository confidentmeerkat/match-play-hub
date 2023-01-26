import React from "react";
import { Platform } from "react-native";
import Colors from "../../constants/Colors";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_GOOGLE_MAP_KEY } from "../../networks/APiKeys";
import { RFPercentage } from "react-native-responsive-fontsize";
import font_type from "../../resources/fonts";
import FastImage from "react-native-fast-image";
import images from "../../resources/images";
import { ComponentStyle } from "../../../assets/styles/ComponentStyle";

const CommonGooglePlaceAutoComplete = ({
  handleOnLocationSelect,
  placeholder,
  isFrom,
  ref,
  handletextInputProps,
  ...props
}) => {
  return (
    <GooglePlacesAutocomplete
      ref={ref}
      styles={{
        textInputContainer: {
          borderRadius: 15,
          borderWidth: 0.2,
          borderColor: Colors.LITE_GREY,
          height: 50,
          color: Colors.BLACK,
          backgroundColor: Colors.LITE_GREY,
        },
        container: {
          backgroundColor: Colors.LITE_GREY,
        },
        description: {
          fontWeight: "bold",
        },
        textInput: {
          height: 50,
          backgroundColor: Colors.LITE_GREY,
          fontSize:
            Platform.OS == "android" ? RFPercentage(2.3) : RFPercentage(2),
          fontFamily: font_type.FontRegular,
          color: Colors.BLACK,
          left: isFrom == "Match" ? -4 : 0,
        },

        listView: {
          color: "black", //To see where exactly the list is
          zIndex: 16, //To popover the component outwards
          // position:'relative'
        },
      }}
      getDefaultValue={() => {
        return ""; // text input default value
      }}
      fetchDetails={true}
      showsVerticalScrollIndicator={false}
      renderDescription={(row) => row.description}
      placeholder={placeholder}
      textInputProps={handletextInputProps}
      textInputHide={false}
      onPress={handleOnLocationSelect}
      autoFocus={false}
      // listViewDisplayed="auto"
      returnKeyType={"search"}
      debounce={200}
      query={{
        key: API_GOOGLE_MAP_KEY,
        language: "en",
        components: "country:us",
      }}
      keyboardShouldPersistTaps={'handled'}
      listViewDisplayed={false}
      renderLeftButton={
        isFrom == "Match"
          ? null
          : () => (
              <FastImage
                style={[
                  ComponentStyle.search_icon,
                  { tintColor: Colors.LITE_GREY },
                ]}
                source={images.search_img}
                resizeMode={FastImage.resizeMode.contain}
              />
            )
      }
    ></GooglePlacesAutocomplete>
  );
};
export default CommonGooglePlaceAutoComplete;
