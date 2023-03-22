import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MatchTabScreen from "./MatchTab/MatchTabScreen";
import PlayTabScreen from "./PlayTab/PlayTabScreen";
import HubTabScreen from "./HubTab/HubTabScreen";
import HomeTab from "../../components/tabs/HomeTab";
import { createStackNavigator } from "@react-navigation/stack";
import FindMatchScreen from "./MatchTab/Users/FindMatchScreen";
import CreateMatchScreen from "./MatchTab/Organizer/CreateMatchScreen";
import ListViewMatchScreen from "./MatchTab/Users/ListViewMatchScreen";
import MapViewMatchScreen from "./MatchTab/Users/MapViewMatchScreen";
import InviteFriendsScreen from "./MatchTab/Organizer/InviteFriendsScreen";
import FindMatchFilterScreen from "./MatchTab/Users/FindMatchFilterScreen";
import MatchDetailUserInvitedScreen from "./MatchTab/Users/MatchDetailUserInvitedScreen";
import UserConfirmationScreen from "./MatchTab/Users/UserConfirmationScreen";
import UserRequestScreen from "./MatchTab/Users/UserRequestScreen";
import CompletedMatchScreen from "./MatchTab/Users/CompletedMatchScreen";
import ReMatchScreen from "./MatchTab/Organizer/ReMatchScreen";
import MatchDetailInterestedandConfirmPlayersScreen from "./MatchTab/Organizer/MatchDetailInterestedandConfirmPlayersScreen";
import EditorDeleteMatchScreen from "./MatchTab/Organizer/EditorDeleteMatchScreen";
import OnlyMatchDetailScreen from "./MatchTab/Users/OnlyMatchDetailScreen";
import EditMatchScreen from "./MatchTab/Organizer/EditMatchScreen";
import MapViewScreen from "./MatchTab/Users/MapViewScreen";
import MatchwithFiltersScreen from "./MatchTab/Users/MatchwithFiltersScreen";
import MatchWithListingScreen from "./MatchTab/Users/MatchWithListingScreen";
import SearchFiltersScreen from "./PlayTab/SearchFiltersScreen";
import MyPlayerScreen from "./PlayTab/MyPlayerScreen";
import FindPlayerScreen from "./PlayTab/FindPlayerScreen";
import AllConnectionDetailScreen from "./PlayTab/AllConnectionDetailScreen";
import PlayerDetailScreen from "./PlayTab/PlayerDetailScreen";
import PendingConnectionDetailScreen from "./PlayTab/PendingConnectionDetailScreen";
import SettingScreen from "./HubTab/SettingScreen";
import EditProfileScreen from "./HubTab/EditProfileScreen";
import BarcodeScreen from "./HubTab/BarcodeScreen";
import GenrateQrCodeScreen from "./HubTab/GenrateQrCodeScreen";
import PrivacyPolicyScreen from "./HubTab/PrivacyPolicyScreen";
import HelpCenterScreen from "./HubTab/HelpCenterScreen";
import MyProfileScreen from "./HubTab/MyProfileScreen";
import ChatListingScreen from "../chat/ChatListingScreen";
import ChatDetailScreen from "../chat/ChatDetailScreen";
import SearchUserScreen from "../chat/SearchUserScreen";
import ChatFilterScreen from "../chat/ChatFilterScreen";
import ChatSearchFilterScreen from "../chat/ChatSearchFilterScreen";
import DeleteMyDataScreen from "./HubTab/DeleteMyDataScreen";

const Tab = createBottomTabNavigator();
const MatchStack = createStackNavigator();
const PlayStack = createStackNavigator();
const HubStack = createStackNavigator();

function MatchStackScreen() {
  return (
    <MatchStack.Navigator initialRouteName="MATCH">
      <MatchStack.Screen
        name="FindMatch"
        component={FindMatchScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="ListViewMatch"
        component={ListViewMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="MyPlayer"
        component={MyPlayerScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="SearchFilters"
        component={SearchFiltersScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="FindPlayer"
        component={FindPlayerScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="PendingConnectionDetail"
        component={PendingConnectionDetailScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="MapViewMatch"
        component={MapViewMatchScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="InviteFriends"
        component={InviteFriendsScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="UserRequest"
        component={UserRequestScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="CompletedMatch"
        component={CompletedMatchScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="FindMatchFilter"
        component={FindMatchFilterScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="MatchDetailUserInvited"
        component={MatchDetailUserInvitedScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="UserConfirmation"
        component={UserConfirmationScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="ReMatch"
        component={ReMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="MatchDetailInterestedandConfirmPlayers"
        component={MatchDetailInterestedandConfirmPlayersScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="EditorDeleteMatch"
        component={EditorDeleteMatchScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="OnlyMatchDetail"
        component={OnlyMatchDetailScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="EditMatch"
        component={EditMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="MatchwithFilters"
        component={MatchwithFiltersScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="MapView"
        component={MapViewScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="MATCH"
        component={MatchTabScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="MatchWithListing"
        component={MatchWithListingScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <MatchStack.Screen
        name="ChatListing"
        component={ChatListingScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="ChatSearchFilter"
        component={ChatSearchFilterScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="ChatFilter"
        component={ChatFilterScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="SearchUser"
        component={SearchUserScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="PlayerDetail"
        component={PlayerDetailScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="AllConnectionDetail"
        component={AllConnectionDetailScreen}
        options={{ headerShown: false }}
      />
      <MatchStack.Screen
        name="PLAY"
        component={PlayTabScreen}
        options={{ headerShown: false }}
        initialParams={{ isfrom: "" }}
      />
    </MatchStack.Navigator>
  );
}

function PlayStackScreen() {
  return (
    <PlayStack.Navigator initialRouteName="PLAY">
      <PlayStack.Screen
        name="PendingConnectionDetail"
        component={PendingConnectionDetailScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="SearchFilters"
        component={SearchFiltersScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="MyPlayer"
        component={MyPlayerScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="AllConnectionDetail"
        component={AllConnectionDetailScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="PlayerDetail"
        component={PlayerDetailScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="FindPlayer"
        component={FindPlayerScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="PLAY"
        component={PlayTabScreen}
        options={{ headerShown: false }}
        initialParams={{ isfrom: "" }}
      />
      <PlayStack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <PlayStack.Screen
        name="ChatListing"
        component={ChatListingScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="ChatSearchFilter"
        component={ChatSearchFilterScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="ChatFilter"
        component={ChatFilterScreen}
        options={{ headerShown: false }}
      />

      <PlayStack.Screen
        name="SearchUser"
        component={SearchUserScreen}
        options={{ headerShown: false }}
      />
      <PlayStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </PlayStack.Navigator>
  );
}
function HubStackScreen() {
  return (
    <HubStack.Navigator >
      <HubStack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{ headerShown: false }}
      />

      <HubStack.Screen
        name="GenrateQrCode"
        component={GenrateQrCodeScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="Barcode"
        component={BarcodeScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="HUB"
        component={HubTabScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="ChatListing"
        component={ChatListingScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="MatchWithListing"
        component={MatchWithListingScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="MyPlayer"
        component={MyPlayerScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="SearchFilters"
        component={SearchFiltersScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="FindPlayer"
        component={FindPlayerScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="PendingConnectionDetail"
        component={PendingConnectionDetailScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="ChatSearchFilter"
        component={ChatSearchFilterScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="EditorDeleteMatch"
        component={EditorDeleteMatchScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="ChatFilter"
        component={ChatFilterScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="SearchUser"
        component={SearchUserScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="OnlyMatchDetail"
        component={OnlyMatchDetailScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="MatchDetailInterestedandConfirmPlayers"
        component={MatchDetailInterestedandConfirmPlayersScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="MapView"
        component={MapViewScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="InviteFriends"
        component={InviteFriendsScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="MatchwithFilters"
        component={MatchwithFiltersScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="EditMatch"
        component={EditMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="DeleteMyData"
        component={DeleteMyDataScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="FindMatch"
        component={FindMatchScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="ListViewMatch"
        component={ListViewMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="MapViewMatch"
        component={MapViewMatchScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="UserRequest"
        component={UserRequestScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="CompletedMatch"
        component={CompletedMatchScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="FindMatchFilter"
        component={FindMatchFilterScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="MatchDetailUserInvited"
        component={MatchDetailUserInvitedScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="UserConfirmation"
        component={UserConfirmationScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="ReMatch"
        component={ReMatchScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <HubStack.Screen
        name="PlayerDetail"
        component={PlayerDetailScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="AllConnectionDetail"
        component={AllConnectionDetailScreen}
        options={{ headerShown: false }}
      />
      <HubStack.Screen
        name="PLAY"
        component={PlayTabScreen}
        options={{ headerShown: false }}
        initialParams={{ isfrom: "" }}
      />
    </HubStack.Navigator>
  );
}

function HomeStack() {
  return (
    <Tab.Navigator
      tabBar={(props) => <HomeTab {...props} />}
      initialRouteName="HUB"
    >
      <Tab.Screen
        name="MATCH"
        component={MatchStackScreen}
        options={({ navigation }) => ({
          tabBarButton: (props) => (
            <TouchableOpacity onPress={() => navigation.navigate("MATCH")}>
              Settings
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="PLAY"
        component={PlayStackScreen}
        initialParams={{ isfrom: "" }}
      />
      <Tab.Screen name="HUB" component={HubStackScreen} />
    </Tab.Navigator>
  );
}

export default HomeStack;
