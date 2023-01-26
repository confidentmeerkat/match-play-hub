import React from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { TabStyle } from "../../../assets/styles/TabStyle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constants/Colors";
import { ProfileStyle } from "../../../assets/styles/ProfileStyle";
import strings from "../../resources/languages/strings";
import images from "../../resources/images";
import HeadingWithText from "../../components/RenderFlatlistComponent/HeadingWithText";
import CustomOnebuttonComponent from "../../components/buttons/CustomOnebuttonComponent";
import font_type from "../../resources/fonts";

const renderconfirmedPlayersListview = (item, index) => {
  return (
    <View style={TabStyle.renderSportsFlatview}>
      <FastImage
        style={{ width: wp(11), height: wp(11), borderRadius: wp(11) / 2 }}
        source={
          item.profile_url === ""
            ? images.dummy_user_img
            : { uri: item.profile_url }
        }
      ></FastImage>
    </View>
  );
};

const renderOpenSlotsList = (secondheadingdata) => {
  return (
    <View
      style={[
        TabStyle.roundedview,
        { marginTop: hp(1.5), backgroundColor: Colors.PRIMARY },
      ]}
    >
      <Text style={[TabStyle.smallheadertext, { color: Colors.WHITE }]}>
        {secondheadingdata}
      </Text>
    </View>
  );
};

const MatchDetailComponent = ({
  date,
  month,
  matchName,
  matchLevel,
  datetime,
  location,
  cost,
  age,
  gender,
  day,
  message,
  firstheadingtitle,
  firstheadingdata,
  secondheadingtitle,
  secondheadingdata,
  organizertitle,
  organizerImage,
  organizerUsername,
  organizerGender,
  organizerAgePreference,
  organizerLocation,
  organizerMessages,
  gotoMapScreen,
  onMatchClick,
  onPressSegmentOne,
  organizer_user_id,
  isOrganizer,
  is_friend,
  is_request,
  onPresssendRequest,
  is_receive_request,
  onPressmanageRequest,
  ...props
}) => {
  return (
    <>
      <View style={[TabStyle.submatchview, { justifyContent: "center" }]}>
        {onMatchClick ? (
          <TouchableOpacity onPress={onMatchClick}>
            <FastImage
              resizeMode="contain"
              tintColor={Colors.PRIMARY}
              style={[ProfileStyle.calendarimg, { marginHorizontal: wp(4) }]}
              source={images.calendar_img}
            ></FastImage>
          </TouchableOpacity>
        ) : null}

        <View>
          <Text
            numberOfLines={1}
            style={[
              TabStyle.smalltextview,
              { color: Colors.PRIMARY, fontFamily: font_type.FontSemiBold },
            ]}
          >
            {month}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              TabStyle.smalltextview,
              {
                textAlign: "center",
                color: Colors.PRIMARY,
                fontFamily: font_type.FontExtraBold,
              },
            ]}
          >
            {date}
          </Text>
        </View>

        <View style={TabStyle.shortLine} />
        <View>
          <Text numberOfLines={1} style={[TabStyle.headertext]}>
            {matchName} {matchLevel ? "(" + matchLevel + ")" : ""}
          </Text>
          <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
            {day + ", " + datetime}
          </Text>
        </View>
      </View>

      <View style={TabStyle.dropdownmargins}>
        <View style={TabStyle.centerLocationtext}>
          {location && 1 == 2 ? (
            <View
              style={[TabStyle.rowFlexDiretion, { marginVertical: hp(0.5) }]}
            >
              <FastImage
                resizeMode="contain"
                tintColor={Colors.GREY}
                style={[ProfileStyle.locationicon, { marginTop: 1 }]}
                source={images.fill_location_img}
              ></FastImage>
              <Text
                numberOfLines={2}
                style={[TabStyle.smalltextview, { marginBottom: hp(0.5) }]}
              >
                {location}
              </Text>
            </View>
          ) : null}

          {gotoMapScreen ? (
            <TouchableOpacity
              style={[TabStyle.rowFlexDiretion]}
              onPress={gotoMapScreen}
            >
              <FastImage
                resizeMode="contain"
                tintColor={Colors.GREY}
                style={[ProfileStyle.locationicon, { marginTop: 1 }]}
                source={images.fill_location_img}
              ></FastImage>
              <Text
                numberOfLines={2}
                style={[TabStyle.smalltextview, { color: Colors.PRIMARY }]}
              >
                {location}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={{ marginVertical: hp(2) }}>
        {cost ? (
          <View style={TabStyle.matchdetailmargins}>
            <Text
              numberOfLines={1}
              style={[TabStyle.smalltextview, { color: Colors.BLACK }]}
            >
              {cost}
            </Text>
          </View>
        ) : null}
        {age ? (
          <View style={TabStyle.matchdetailmargins}>
            <Text
              numberOfLines={1}
              style={[TabStyle.smalltextview, { color: Colors.BLACK }]}
            >
              {age}
            </Text>
          </View>
        ) : null}
        {gender ? (
          <View style={TabStyle.matchdetailmargins}>
            <Text
              numberOfLines={1}
              style={[TabStyle.smalltextview, { color: Colors.BLACK }]}
            >
              {gender}
            </Text>
          </View>
        ) : null}
      </View>
      {/* {message ? (
        <View style={TabStyle.matchdetailmargins}>
          <Text
            numberOfLines={2}
            style={[TabStyle.smalltextview, { color: Colors.BLACK }]}
          >
            {message}
          </Text>
        </View>
      ) : null} */}

      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginBottom: hp(3) }}
      >
        {firstheadingdata ? (
          <View style={TabStyle.dropdownmargins}>
            <HeadingWithText
              titleText={firstheadingtitle}
              marginVerticalview={hp(1)}
            />
            <FlatList
              data={firstheadingdata}
              renderItem={({ item, index }) =>
                renderconfirmedPlayersListview(item, index)
              }
              bounces={false}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              listKey={(item, index) => "D" + index.toString()}
              keyExtractor={(item, index) => "D" + index.toString()}
            />
          </View>
        ) : null}
        {secondheadingdata ? (
          <View style={TabStyle.dropdownmargins}>
            <HeadingWithText
              titleText={secondheadingtitle}
              marginVerticalview={hp(1)}
            />
            {renderOpenSlotsList(secondheadingdata)}
          </View>
        ) : null}
        {organizertitle ? (
          <View style={TabStyle.dropdownmargins}>
            <HeadingWithText
              titleText={organizertitle}
              marginVerticalview={hp(1)}
            />
            <View style={TabStyle.organizerview}>
              <View style={ProfileStyle.middle_view}>
                <FastImage
                  resizeMethod="resize"
                  style={TabStyle.userImg}
                  source={organizerImage}
                ></FastImage>
              </View>
              <View style={TabStyle.centerOrganizerInfo}>
                <Text numberOfLines={1} style={ProfileStyle.headertext}>
                  {organizerUsername}
                </Text>
                {isOrganizer ? (
                  organizerGender ? (
                    <View style={TabStyle.rowFlexDiretion}>
                      <Text
                        numberOfLines={1}
                        style={ProfileStyle.smalltextview}
                      >
                        {organizerGender}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[ProfileStyle.smalltextview]}
                      >
                        {organizerAgePreference
                          ? ", " + organizerAgePreference
                          : ""}
                      </Text>
                    </View>
                  ) : null
                ) : null}

                {organizerLocation ? (
                  <View style={TabStyle.rowFlexDiretion}>
                    <FastImage
                      resizeMode="contain"
                      tintColor={Colors.GREY}
                      style={[ProfileStyle.locationicon, { marginTop: 1 }]}
                      source={images.fill_location_img}
                    ></FastImage>

                    <Text numberOfLines={1} style={ProfileStyle.smalltextview}>
                      {organizerLocation}
                    </Text>
                  </View>
                ) : null}

                {is_friend == true &&
                is_request == false &&
                is_receive_request == false ? (
                  <View style={{ marginTop: hp(2) }}>
                    <CustomOnebuttonComponent
                      segmentOneTitle={organizerMessages}
                      segmentOneImage={images.messages_img}
                      segmentOneTintColor={Colors.PRIMARY}
                      onPressSegmentOne={onPressSegmentOne}
                    />
                  </View>
                ) : is_friend == false &&
                  is_request == false &&
                  isOrganizer != true &&
                  is_receive_request == false ? (
                  <View style={{ marginTop: hp(2) }}>
                    <CustomOnebuttonComponent
                      segmentOneTitle={strings.sendRequest}
                      segmentOneImage={images.round_right_img}
                      segmentOneTintColor={Colors.PRIMARY}
                      onPressSegmentOne={onPresssendRequest}
                    />
                  </View>
                ) : is_friend == false &&
                  is_request == true &&
                  is_receive_request == false ? (
                  <View
                    style={[
                      TabStyle.squareView,
                      { width: "70%", marginTop: hp(2) },
                    ]}
                  >
                    <Text numberOfLines={1} style={[TabStyle.smalltextview]}>
                      {strings.alreadySendRequest}
                    </Text>
                  </View>
                ) : is_receive_request == true &&
                  is_friend == false &&
                  is_request == false ? (
                  <View style={{ marginTop: hp(2) }}>
                    <CustomOnebuttonComponent
                      segmentOneTitle={strings.manageRequest}
                      segmentOneImage={images.round_right_img}
                      segmentOneTintColor={Colors.PRIMARY}
                      onPressSegmentOne={onPressmanageRequest}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};
export default MatchDetailComponent;
