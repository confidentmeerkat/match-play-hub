import { API_HOST } from "../../config";

// const BASE_URL = API_HOST;
// const BASE_URL = "http://matchplayhub-env.eba-qk8jzdys.us-west-2.elasticbeanstalk.com/api/";
const BASE_URL = "http://localhost:8000/api/";
const LOCATION_BASE_URL =
  "https://maps.googleapis.com/maps/api/geocode/json?address=";
const LOCATION_BASE_URL_FROM_PINCODE =
  "https://maps.googleapis.com/maps/api/geocode/json?key=";
const ApiUrls = {
  LOCATION_BASE_URL: LOCATION_BASE_URL,
  LOCATION_BASE_URL_FROM_PINCODE: LOCATION_BASE_URL_FROM_PINCODE,
  LOGIN: BASE_URL + "login",
  FBLOGIN: BASE_URL + 'facebook/login',
  REGISTER: BASE_URL + "register",
  SEND_OTP: BASE_URL + "sendOtp",
  PROFILE: BASE_URL + "profile",
  FORGOTPASS: BASE_URL + "forgotpassword",
  UPDATEPASS: BASE_URL + "updatepassword",
  LOGOUT: BASE_URL + "logout",
  REFRESH_TOKEN: BASE_URL + "refreshtoken",
  UPDATE_PROFILES: BASE_URL + "updateProfile",
  GET_SPORTS: BASE_URL + "getSports",
  GET_SETTINGS: BASE_URL + "getUserSetting",
  STORE_SETTINGS: BASE_URL + "storeSetting",
  GET_ALL_CONNECTION: BASE_URL + "allConnection",
  GET_PENDING_CONNECTION: BASE_URL + "pendingConnection",
  SENT_FRIEND_REQUEST: BASE_URL + "sentRequest",
  ACCEPT_FRIEND_REQUEST: BASE_URL + "accepteRequest",
  GET_ALL_USERS: BASE_URL + "allUsers",
  GET_SPORT_TITLES: BASE_URL + "sportDetail",
  CREATE_SPORT: BASE_URL + "createMatch",
  GET_INVITE_PLAYERS: BASE_URL + "invitedPlayers",
  GET_UPCOMING_MATCH: BASE_URL + "upcomingMatch",
  CONFIRM_AND_DECLINE_MATCH: BASE_URL + "confirmDeclineMatch",
  GET_USER_UPCOMING_MATCHES: BASE_URL + "userUpcomingMatches",
  DELETE_MATCH: BASE_URL + "deleteMatch",
  FIND_MATCH: BASE_URL + "findMatch",
  REQUEST_TO_PLAY: BASE_URL + "requestToPlayMatch",
  GET_USER_LOCATION: BASE_URL + "getUserLocation",
  INTERESTED_PLAYERS_LIST: BASE_URL + "interestedPlayer",
  UPDATE_MATCH: BASE_URL + "updateMatch",
  GET_MATCH_DETAIL: BASE_URL + "getMatchDetail",
  INVITED_PLAYER: BASE_URL + "invitedPlayer",
  REMATCH: BASE_URL + "rematch",
  CHECK_USER_EXIST_OR_NOT: BASE_URL + "checkUserExist",
  GET_SPORTS_TITLE_AND_CATEGORY: BASE_URL + "sportDetailWithCategory",
  GET_CHAT_LIST: BASE_URL + "getUserMessageList",
  SEND_MESSAGE: BASE_URL + "sendMessages",
  CHAT_DETAIL: BASE_URL + "getUserMessage",
  DELETE_CHAT: BASE_URL + "deleteUserChat",
  SEARCH_USERS: BASE_URL + "getChatUsers",
  ARCHIVE_CHAT: BASE_URL + "archiveChat",
  BLOCK_USER: BASE_URL + "blockUser",
  GET_ARCIVE_CHAT_LIST: BASE_URL + "getArchiveList",
  GET_BLOCK_CHAT_LIST: BASE_URL + "getBlockedChatlist",
  DELETE_CONNECTION: BASE_URL + "deleteConnection",
  DELETE_ACCOUNT: BASE_URL + "deletePlayerProfile",
};
export default ApiUrls;
