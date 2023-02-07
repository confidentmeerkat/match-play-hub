import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/auths/LoginScreen";
import RegisterScreen from "./screens/auths/RegisterScreen";
import ForgotPasswordScreen from "./screens/auths/ForgotPasswordScreen";
import AuthLoadingScreen from "./screens/auths/AuthLoadingScreen";
import HomeScreen from "./screens/hometabs/HomeScreen";
import SettingScreen from "./screens/hometabs/HubTab/SettingScreen";
import EditProfileScreen from "./screens/hometabs/HubTab/EditProfileScreen";
import BarcodeScreen from "./screens/hometabs/HubTab/BarcodeScreen";
import PlayerDetailScreen from "./screens/hometabs/PlayTab/PlayerDetailScreen";
import PendingConnectionDetailScreen from "./screens/hometabs/PlayTab/PendingConnectionDetailScreen";
import FindMatchScreen from "./screens/hometabs/MatchTab/Users/FindMatchScreen";
import CreateMatchScreen from "./screens/hometabs/MatchTab/Organizer/CreateMatchScreen";
import GenrateQrCodeScreen from "./screens/hometabs/HubTab/GenrateQrCodeScreen";
import ListViewMatchScreen from "./screens/hometabs/MatchTab/Users/ListViewMatchScreen";
import MapViewMatchScreen from "./screens/hometabs/MatchTab/Users/MapViewMatchScreen";
import FindPlayerScreen from "./screens/hometabs/PlayTab/FindPlayerScreen";
import AllConnectionDetailScreen from "./screens/hometabs/PlayTab/AllConnectionDetailScreen";
import MyPlayerScreen from "./screens/hometabs/PlayTab/MyPlayerScreen";
import InviteFriendsScreen from "./screens/hometabs/MatchTab/Organizer/InviteFriendsScreen";
import FindMatchFilterScreen from "./screens/hometabs/MatchTab/Users/FindMatchFilterScreen";
import MatchDetailUserInvitedScreen from "./screens/hometabs/MatchTab/Users/MatchDetailUserInvitedScreen";
import UserConfirmationScreen from "./screens/hometabs/MatchTab/Users/UserConfirmationScreen";
import UserRequestScreen from "./screens/hometabs/MatchTab/Users/UserRequestScreen";
import CompletedMatchScreen from "./screens/hometabs/MatchTab/Users/CompletedMatchScreen";
import ReMatchScreen from "./screens/hometabs/MatchTab/Organizer/ReMatchScreen";
import MatchDetailInterestedandConfirmPlayersScreen from "./screens/hometabs/MatchTab/Organizer/MatchDetailInterestedandConfirmPlayersScreen";
import EditorDeleteMatchScreen from "./screens/hometabs/MatchTab/Organizer/EditorDeleteMatchScreen";
import OnlyMatchDetailScreen from "./screens/hometabs/MatchTab/Users/OnlyMatchDetailScreen";
import EditMatchScreen from "./screens/hometabs/MatchTab/Organizer/EditMatchScreen";
import ChatListingScreen from "./screens/chat/ChatListingScreen";
import ChatDetailScreen from "./screens/chat/ChatDetailScreen";
import SearchUserScreen from "./screens/chat/SearchUserScreen";
import SearchFiltersScreen from "./screens/hometabs/PlayTab/SearchFiltersScreen";
import MapViewScreen from "./screens/hometabs/MatchTab/Users/MapViewScreen";
import PrivacyPolicyScreen from "./screens/hometabs/HubTab/PrivacyPolicyScreen";
import HelpCenterScreen from "./screens/hometabs/HubTab/HelpCenterScreen";
import MyProfileScreen from "./screens/hometabs/HubTab/MyProfileScreen";
import MatchwithFiltersScreen from "./screens/hometabs/MatchTab/Users/MatchwithFiltersScreen";
import NewAccountScreen from "./screens/auths/NewAccountScreen";
import ChatFilterScreen from "./screens/chat/ChatFilterScreen";
import ChatSearchFilterScreen from "./screens/chat/ChatSearchFilterScreen";
import DeleteMyDataScreen from "./screens/hometabs/HubTab/DeleteMyDataScreen";
import TermAndConditionScreen from "./screens/auths/TermAndConditionScreen";
import StartScreen from "./screens/auths/StartScreen";
import LoginChooseScreen from "./screens/auths/LoginChooseScreen";
import RegisterChooseScreen from "./screens/auths/RegisterChooseScreen";
import EnterCodeScreen from "./screens/auths/EnterCodeScreen";
import CreatePasswordScreen from "./screens/auths/CreatePasswordScreen";
import CreateAccountScreen from "./screens/auths/CreateAcountScreen";
import { Image } from "native-base";
import images from "./resources/images";
import Video from "react-native-video";
import { StyleSheet } from "react-native";
import { horizontalScale as hs, verticalScale as vs } from "./utils/metrics";
/**
 * Define your screen heres
 * @name is Route Name
 * @component is Screen file
 * @options is Screen's options
 */
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  logo: {
    width: hs(275),
    aspectRatio: 700 / 250,
  },
  noHeaderShadow: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
});

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{
        headerStyle: {
          ...styles.noHeaderShadow,
        },
        headerLeftContainerStyle: {
          marginLeft: hs(22),
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Start" component={StartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginChoose" component={LoginChooseScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="RegisterChoose"
        component={RegisterChooseScreen}
        options={{
          headerShown: true,
          headerBackImage: () => <Image source={images.header_back_img} resizeMode="center" alt="logo" />,
          headerStatusBarHeight: 0,
          headerStyle: { height: vs(70), ...styles.noHeaderShadow },
          headerTitle: () => (
            <Video
              style={styles.logo}
              source={require("./components/Animation/logo_ani.mp4")} // Can be a URL or a local file.
              resizeMode="cover"
              hideShutterView
              repeat
            />
          ),
        }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{
          headerShown: true,
          headerBackImage: () => <Image source={images.header_back_img} resizeMode="center" alt="logo" />,
          headerStatusBarHeight: 0,
          headerStyle: {
            height: vs(70),
            ...styles.noHeaderShadow,
          },
          headerTitle: () => (
            <Video
              style={styles.logo}
              source={require("./components/Animation/logo_ani.mp4")} // Can be a URL or a local file.
              resizeMode="cover"
              hideShutterView
              repeat
            />
          ),
        }}
      />
      <Stack.Screen
        name="EnterCode"
        component={EnterCodeScreen}
        options={{
          headerShown: true,
          headerBackImage: () => <Image source={images.header_back_img} resizeMode="center" alt="logo" />,
          headerStatusBarHeight: 0,
          headerTitle: false,
        }}
      />
      <Stack.Screen
        name="CreatePassword"
        component={CreatePasswordScreen}
        options={{
          headerShown: true,
          headerBackImage: () => <Image source={images.header_back_img} resizeMode="center" alt="logo" />,
          headerStatusBarHeight: 0,
          headerTitle: false,
          headerBackTitleVisible: "",
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermAndCondition" component={TermAndConditionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="Barcode" component={BarcodeScreen} options={{ headerShown: false }} />

      <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="PendingConnectionDetail"
        component={PendingConnectionDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="FindMatch" component={FindMatchScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="GenrateQrCode" component={GenrateQrCodeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ListViewMatch"
        component={ListViewMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="MapViewMatch" component={MapViewMatchScreen} options={{ headerShown: false }} />

      <Stack.Screen name="FindPlayer" component={FindPlayerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AllConnectionDetail" component={AllConnectionDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MyPlayer" component={MyPlayerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="FindMatchFilter"
        component={FindMatchFilterScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="MatchDetailUserInvited"
        component={MatchDetailUserInvitedScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="UserConfirmation" component={UserConfirmationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserRequest" component={UserRequestScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CompletedMatch" component={CompletedMatchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReMatch" component={ReMatchScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="MatchDetailInterestedandConfirmPlayers"
        component={MatchDetailInterestedandConfirmPlayersScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="EditorDeleteMatch" component={EditorDeleteMatchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnlyMatchDetail" component={OnlyMatchDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditMatch"
        component={EditMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="ChatListing" component={ChatListingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SearchFilters" component={SearchFiltersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MapView" component={MapViewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MatchwithFilters" component={MatchwithFiltersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SearchUser" component={SearchUserScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NewAccount" component={NewAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatFilter" component={ChatFilterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatSearchFilter" component={ChatSearchFilterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeleteMyData" component={DeleteMyDataScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
export default MyStack;
