import React from "react";
import { Box, Button, HStack, Image, Text, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import Colors from "../../../constants/Colors";
import images from "../../../resources/images";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../utils/metrics";

const MatchCard = ({ item }) => {
  return (
    <Box borderWidth={1} width={`${hs(140)}px`} rounded="lg" borderColor="#FFB800" m={1}>
      <HStack width="full" justifyContent="flex-end" pr={`${hs(6)}px`}>
        <Text fontSize={`${hs(7)}px`}>{item.is_status === "Organizer" ? "Organizer" : "Player"}</Text>
      </HStack>

      <HStack width="full" rounded="full" mb={`${hs(12)}px`}>
        <VStack alignItems="center" width={`${hs(45)}px`}>
          <Text fontSize={`${ms(9)}px`}>{item.match_month}</Text>
          <Text fontSize={`${ms(12)}px`}>{item.match_date}</Text>
          <Text fontSize={`${ms(7)}px`}>{item.match_day}</Text>
          <Text fontSize={`${ms(6)}px`}>{item.match_time}</Text>
        </VStack>

        <Box height="full" borderColor="blue.600" borderWidth={1}></Box>

        <VStack flexGrow={1} mx={`${hs(6)}px`}>
          <HStack>
            <Text fontSize={`${ms(10)}px`} color="#FFB800">
              {item.sport}
            </Text>
          </HStack>
          <HStack>
            <FastImage
              resizeMode="contain"
              tintColor={Colors.GREY}
              source={images.fill_location_img}
              styl={{ width: hs(8), height: hs(8) }}
            ></FastImage>
            <Text fontSize={`${ms(7)}px`} numberOfLines={1}>
              {item.location ? item.location : ""}
            </Text>
          </HStack>

          <HStack alignItems="center" flexGrow={1} my={`${hs(5)}px`} space={1}>
            <Image
              source={images.dummy_user_img}
              borderWidth={1}
              width={`${hs(25)}px`}
              height={`${hs(25)}px`}
              resizeMode="contain"
              resizeMethod="resize"
              rounded="full"
            />

            {item.is_status === "Organizer" ? (
              <VStack space={1} alignItems="center" flex={1}>
                <Button
                  rounded="full"
                  height={`${vs(12)}px`}
                  bgColor="blue.600"
                  _text={{ fontSize: `${ms(5)}px` }}
                  p={0}
                  width="full"
                >
                  1 Spot open
                </Button>
                <Button
                  rounded="full"
                  height={`${vs(12)}px`}
                  bgColor="blue.600"
                  _text={{ fontSize: `${ms(5)}px` }}
                  p={0}
                  width="full"
                >
                  2 Spots Filled
                </Button>
              </VStack>
            ) : (
              <VStack space={1} alignItems="center" flex={1}>
                <Button
                  rounded="full"
                  height={`${vs(12)}px`}
                  bgColor="blue.600"
                  _text={{ fontSize: `${ms(5)}px` }}
                  p={0}
                  width="full"
                >
                  Accept
                </Button>
                <Button
                  rounded="full"
                  height={`${vs(12)}px`}
                  bgColor="blue.600"
                  _text={{ fontSize: `${ms(5)}px` }}
                  p={0}
                  width="full"
                >
                  Decline
                </Button>
              </VStack>
            )}
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default MatchCard;
