import React, { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  FlatList,
  HStack,
  IconButton,
  Image,
  ScrollView,
  SmallCloseIcon,
  Text,
  View,
  VStack,
} from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import { Shadow } from "react-native-shadow-2";
import { horizontalScale as hs, verticalScale as vs, moderateScale as ms } from "../../../utils/metrics";
import images from "../../../resources/images";
import { ImageBackground } from "react-native";
import MatchCard from "./MatchCard";

const colorCodes = {
  B: "black",
  P: "green.600",
  I: "#FFB800",
  A: "red.600",
};

const testMatches = [
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Organizer",
    match_time: "10:00 PM",
  },
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Invited",
    match_time: "10:00 PM",
  },
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Organizer",
    match_time: "10:00 PM",
  },
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Invited",
    match_time: "10:00 PM",
  },
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Organizer",
    match_time: "10:00 PM",
  },
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Invited",
    match_time: "10:00 PM",
  },
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Organizer",
    match_time: "10:00 PM",
  },
  {
    sport: "18 holes golf",
    location: "123 Street, city, FL",
    match_date: "31",
    match_day: "Mon",
    match_month: "Jan",
    player_limit: 4,
    open_sports: 2,
    confirmed: 1,
    is_status: "Invited",
    match_time: "10:00 PM",
  },
];

const HubTab = () => {
  const {
    finalMatchData = [],
    player_request = [],
    message_request = [],
  } = useSelector((state) => state.app.responseGetUserUpcomingMatchdata) || {};

  return (
    <ScrollView>
      {!!testMatches.length ? (
        <>
          <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hs(1.5)}px`} height={`${hs(25)}px`}>
            <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
              My Matches Requests
            </Text>
            <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
          </HStack>

          {/* {testMatches.map((item, index) => (
            <MatchCard item={item} key={index} />
          ))} */}
          <FlatList ml={`${wp(5)}px`} data={testMatches} renderItem={MatchCard} horizontal={true} />
        </>
      ) : (
        <Box mx={`${wp(5)}px`} background={images.outline} mt={2} bgColor="white">
          <ImageBackground source={images.outline} resizeMode="stretch">
            <Text fontSize={`${ms(14)}px`} lineHeight={`${ms(28)}px`} fontWeight="bold" textAlign="center">
              Match Request
            </Text>

            <Text fontSize={`${ms(12)}px`} lineHeight={`${ms(28)}px`} textAlign="center">
              You have no matches
            </Text>

            <Box width="full" justifyContent="center" flexDir="row" mt={`${ms(8)}px`} mb={`${ms(16)}px`}>
              <Button
                width={`${hs(167)}px`}
                rounded="full"
                backgroundColor="#E9803A"
                _text={{ fontSize: `${ms(12)}px`, lineHeight: `${ms(24)}px` }}
                py={0}
              >
                Find or Create a Match
              </Button>
            </Box>
          </ImageBackground>
        </Box>
      )}

      {!!player_request.length ? (
        <>
          <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hs(1.5)}px`} height={`${hs(25)}px`}>
            <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
              My Players Requests
            </Text>
            <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
          </HStack>

          <FlatList
            ml={`${wp(5)}px`}
            horizontal={true}
            data={player_request}
            bounces={false}
            renderItem={({ item, index }) => (
              <Center
                width={`${hs(84)}px`}
                m={1}
                rounded="lg"
                borderWidth={1}
                borderColor="gray.700"
                backgroundColor="white"
              >
                <Image
                  alt="user image"
                  mt={2}
                  source={images.dummy_user_img}
                  width={`${hs(40)}px`}
                  height={`${hs(40)}px`}
                  resizeMode="contain"
                  resizeMethod="resize"
                  rounded="full"
                />
                <Text fontSize={`${ms(10)}px`}>{item.name || item.username + " " + item.age}</Text>

                <Text fontSize={`${ms(8)}px`} textAlign="center">{`${item.city}, ${item.state}`}</Text>

                <HStack my="1.5" space={`${hs(10)}px`}>
                  <IconButton
                    width={`${hs(20)}px`}
                    height={`${hs(20)}px`}
                    borderWidth={1}
                    borderColor="blue.600"
                    backgroundColor="white"
                    icon={<SmallCloseIcon />}
                    rounded="full"
                    _icon={{ color: "blue.600" }}
                  />
                  <IconButton
                    width={`${hs(20)}px`}
                    height={`${hs(20)}px`}
                    bgColor="blue.600"
                    color="white"
                    icon={<CheckIcon />}
                    rounded="full"
                    _icon={{ color: "white" }}
                  />
                </HStack>
              </Center>
            )}
          />
        </>
      ) : (
        <Box mx={`${wp(5)}px`} background={images.outline} mt={2} bgColor="white">
          <ImageBackground source={images.outline} resizeMode="stretch">
            <Text fontSize={`${ms(14)}px`} lineHeight={`${ms(28)}px`} fontWeight="bold" textAlign="center">
              Player Requests
            </Text>

            <Text fontSize={`${ms(12)}px`} lineHeight={`${ms(28)}px`} textAlign="center">
              You have no new players.
            </Text>

            <Box width="full" justifyContent="center" flexDir="row" mt={`${ms(8)}px`} mb={`${ms(16)}px`}>
              <Button
                width={`${hs(167)}px`}
                rounded="full"
                backgroundColor="#E9803A"
                _text={{ fontSize: `${ms(12)}px`, lineHeight: `${ms(24)}px` }}
                py={0}
              >
                Find a new player
              </Button>
            </Box>
          </ImageBackground>
        </Box>
      )}

      {!!message_request.length ? (
        <>
          <HStack ml={`${wp(5)}px`} alignItems="center" mt={`${hs(1.5)}px`} height={`${hs(25)}px`}>
            <Text pr={`${wp(3)}px`} fontSize={`${ms(12)}px`} lineHeight={`${ms(18)}px`} color="black">
              About Me
            </Text>
            <Box flex={1} borderColor="gray.300" borderBottomWidth={1} mr={`${wp(2)}px`}></Box>
          </HStack>

          <FlatList
            ml={`${wp(5)}px`}
            horizontal={true}
            data={player_request}
            bounces={false}
            renderItem={({ item, index }) => (
              <Center
                width={`${hs(84)}px`}
                m={1}
                rounded="lg"
                borderWidth={1}
                borderColor="gray.700"
                backgroundColor="white"
              >
                <Image
                  mt={2}
                  source={images.dummy_user_img}
                  width={`${hs(40)}px`}
                  height={`${hs(40)}px`}
                  resizeMode="contain"
                  resizeMethod="resize"
                  rounded="full"
                />
                <Text fontSize={`${ms(10)}px`}>{item.name || item.username + " " + item.age}</Text>

                <Text fontSize={`${ms(8)}px`} textAlign="center">{`${item.city}, ${item.state}`}</Text>

                <HStack my="1.5" space={`${hs(10)}px`} justifyContent="center">
                  <Button
                    _text={{ fontSize: `${ms(5)}px`, lineHeight: `${ms(9)}px` }}
                    p={0}
                    bgColor="blue.600"
                    rounded="full"
                    width={`${hs(50)}px`}
                  >
                    View Messages
                  </Button>
                </HStack>
              </Center>
            )}
          />
        </>
      ) : (
        <Box mx={`${wp(5)}px`} background={images.outline} mt={2} bgColor="white">
          <ImageBackground source={images.outline} resizeMode="stretch">
            <Text fontSize={`${ms(14)}px`} lineHeight={`${ms(28)}px`} fontWeight="bold" textAlign="center">
              New Messages
            </Text>

            <Text fontSize={`${ms(12)}px`} lineHeight={`${ms(28)}px`} textAlign="center">
              You have no new messages.
            </Text>

            <Box width="full" justifyContent="center" flexDir="row" mt={`${ms(8)}px`} mb={`${ms(16)}px`}>
              <Button
                width={`${hs(167)}px`}
                rounded="full"
                backgroundColor="#E9803A"
                _text={{ fontSize: `${ms(12)}px`, lineHeight: `${ms(24)}px` }}
                py={0}
              >
                View Messages
              </Button>
            </Box>
          </ImageBackground>
        </Box>
      )}
    </ScrollView>
  );
};

export default HubTab;
