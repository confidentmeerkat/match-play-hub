import React, { useMemo } from "react";
import { Box, Center, HStack, Image, ScrollView, Text } from "native-base";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../utils/metrics";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import images from "../../../resources/images";

const colorCodes = {
  B: "black",
  P: "green.600",
  I: "#FFB800",
  A: "red.600",
};

const AboutMe = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  const { aboutyou, assign_sport, genderPreference, matchStructure, age_preference } = useMemo(() => {
    return {
      username: currentUser.username ? currentUser.username : "",
      age: currentUser.age ? currentUser.age : "",
      gender: currentUser.gender ? currentUser.gender : "",
      profile_url: currentUser.profile_url ? currentUser.profile_url : "",
      assign_sport: currentUser.assign_sport ? currentUser.assign_sport : [],
      availibility: currentUser.availability_string ? currentUser.availability_string : "",
      aboutyou: currentUser.about_us ? currentUser.about_us : "",
      travelDistance: currentUser.distance ? currentUser.distance : "",
      genderPreference: currentUser.gender_preference ? currentUser.gender_preference : "",
      matchStructure: currentUser.match_structure ? JSON.parse(currentUser.match_structure) || [] : [],
      age_preference: currentUser.age_preference ? JSON.parse(currentUser.age_preference) || [] : [],
      is_request: currentUser.is_request ? currentUser.is_request : "",
      qr_url: currentUser.qr_url ? currentUser.qr_url : "",
      percentage: currentUser.percentage ? currentUser.percentage : "",
      name: currentUser.name ? currentUser.name : "",
    };
  }, [currentUser]);
  return (
    <ScrollView>
      <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hs(1.5)}px`} height={`${hs(25)}px`}>
        <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
          About Me
        </Text>
        <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
      </HStack>

      <Text pl={`${wp(5)}px`} fontSize={`${ms(10)}px`} color="black" mb={`${vs(30)}px`}>
        {aboutyou}
      </Text>

      <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${vs(45)}px`} height={`${hs(25)}px`}>
        <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
          My Sports
        </Text>
        <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
      </HStack>

      <HStack mx={`${wp(5)}px`} mt={`${hs(25)}px`} flexWrap="wrap">
        {(assign_sport || []).map(({ title, status }) => (
          <Box width="1/3" key={title}>
            <Center
              borderColor={colorCodes[status]}
              borderWidth={1}
              flexDirection="row"
              borderRadius="full"
              width={`${hs(100)}px`}
              height={`${vs(35)}px`}
              alignItems="center"
              mb={`${hs(20)}px`}
              px={1}
            >
              <Image height={`${hs(15)}px`} width={`${hs(15)}px`} source={images.tennis_img} />
              <Text
                fontStyle="italic"
                fontWeight="light"
                fontSize={`${ms(12)}px`}
                lineHeight={`${ms(14)}px`}
                ml={`${hs(6)}px`}
                flexWrap="wrap"
                textBreakStrategy="balanced"
                flexShrink={1}
                textAlign="center"
              >
                {title}
              </Text>
            </Center>
          </Box>
        ))}
      </HStack>

      <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${vs(45)}px`} height={`${hs(25)}px`}>
        <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
          My Preference
        </Text>
        <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
      </HStack>

      <HStack mx={`${wp(5)}px`} mt={`${hs(25)}px`} flexWrap="wrap">
        {!!genderPreference && (
          <Box width="1/3">
            <Center
              bgColor="primary"
              borderRadius="full"
              width={`${hs(100)}px`}
              height={`${vs(35)}px`}
              alignItems="center"
              mb={`${hs(20)}px`}
            >
              <Text textAlign="center" color="white" fontStyle="italic" fontWeight="light" fontSize={`${ms(12)}px`}>
                {genderPreference}
              </Text>
            </Center>
          </Box>
        )}
        {age_preference.map(({ name, id }) => (
          <Box width="1/3" key={id}>
            <Center
              bgColor="primary"
              borderRadius="full"
              width={`${hs(100)}px`}
              height={`${vs(35)}px`}
              alignItems="center"
              mb={`${hs(20)}px`}
            >
              <Text textAlign="center" color="white" fontStyle="italic" fontWeight="light" fontSize={`${ms(12)}px`}>
                {name}
              </Text>
            </Center>
          </Box>
        ))}
        {matchStructure.map(({ name, id }) => (
          <Box width="1/3" key={id}>
            <Center
              bgColor="primary"
              borderRadius="full"
              width={`${hs(100)}px`}
              height={`${vs(35)}px`}
              alignItems="center"
              mb={`${hs(20)}px`}
            >
              <Text textAlign="center" color="white" fontStyle="italic" fontWeight="light" fontSize={`${ms(12)}px`}>
                {name}
              </Text>
            </Center>
          </Box>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default AboutMe;
