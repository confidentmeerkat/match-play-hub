import * as types from "../actions/ActionTypes";

const initialState = {
  currentUser: undefined,
  notificationData: undefined,

  isBusyUpdateProfile: false,
  responseUpdateProfiledata: undefined,
  errorUpdateProfiledata: undefined,

  isBusyGetSports: false,
  responseGetSportsdata: undefined,
  errorGetSportsdata: undefined,

  isBusyGetSettings: false,
  responseGetSettingsdata: undefined,
  errorGetSettingsdata: undefined,

  isBusyStoreSettings: false,
  responseStoreSettingsdata: undefined,
  errorStoreSettingsdata: undefined,

  isBusyGetAllConnection: false,
  responseGetAllConnectiondata: undefined,
  errorGetAllConnectiondata: undefined,

  isBusyGetPendingConnection: false,
  responseGetPendingConnectiondata: undefined,
  errorGetPendingConnectiondata: undefined,

  isBusySentFriendRequest: false,
  responseSentFriendRequestdata: undefined,
  errorSentFriendRequestdata: undefined,

  isBusyAcceptFriendRequest: false,
  responseAcceptFriendRequestdata: undefined,
  errorAcceptFriendRequestdata: undefined,

  isBusyGetAllUsersRequest: false,
  responseGetAllUsersdata: undefined,
  errorGetAllUsersdata: undefined,

  isBusyGetSportsTitle: false,
  responseGetSportsTitledata: undefined,
  errorGetSportsTitledata: undefined,

  isBusyCreateSportsRequest: false,
  responseCreateSportsdata: undefined,
  errorCreateSportsdata: undefined,

  isBusyGetAdress: false,
  responseGetAdressdata: undefined,
  errorGetAdressdata: undefined,

  isBusyGetAddressFromPincode: false,
  responseGetAddressFromPincodedata: undefined,
  errorGetAddressFromPincodedata: undefined,

  isBusyGetUpcomingMatch: false,
  responseGetUpcomingMatchdata: undefined,
  errorGetUpcomingMatchdata: undefined,

  isConfirmAndDeclineMatch: false,
  responseConfirmAndDeclinedata: undefined,
  errorConfirmAndDeclinedata: undefined,

  isBusyGetUserUpcomingMatch: false,
  responseGetUserUpcomingMatchdata: undefined,
  errorGetUserUpcomingMatchdata: undefined,

  isBusyDeleteMatch: false,
  responseDeleteMatchdata: undefined,
  errorDeleteMatchdata: undefined,

  isBusyGetStartLocation: false,
  responseGetStartLocationdata: undefined,
  errorGetStartLocationdata: undefined,

  isBusyFindMatch: false,
  responseFindMatchdata: undefined,
  errorFindMatchdata: undefined,

  isBusyRequestToPlayMatch: false,
  responseRequestToPlayMatchdata: undefined,
  errorRequestToPlayMatchdata: undefined,

  isBusyGetUserLocation: false,
  responseBusyGetUserLocationdata: undefined,
  errorBusyGetUserLocationdata: undefined,

  isBusyGetInterestedPlayerList: false,
  responseBusyGetInterestedPlayerListdata: undefined,
  errorBusyGetInterestedPlayerListdata: undefined,

  isBusyGetMatchDetail: false,
  responseGetMatchDetaildata: undefined,
  errorGetMatchDetaildata: undefined,

  isBusyUpdateMatch: false,
  responseUpdateMatchdata: undefined,
  errorUpdateMatchdata: undefined,

  isBusyInvitedPlayer: false,
  responseInvitedPlayerdata: undefined,
  errorInvitedPlayerdata: undefined,

  isBusyRematch: false,
  responseRematchdata: undefined,
  errorRematchdata: undefined,

  isBusyGetTitleAndCategory: false,
  responseGetTitleAndCategorydata: undefined,
  errorGetTitleAndCategorydata: undefined,

  isBusyDeleteAccount: false,
  responseDeleteAccountdata: undefined,
  errorDeleteAccountdata: undefined,

  isBusyDeleteConnection: false,
  responseDeleteConnectiondata: undefined,
  errorDeleteConnectiondata: undefined,
};

export default function AppReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_NOTIFICATION_DATA:
      return {
        ...state,
        notificationData: action.payload,
      };
    case types.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case types.POST_UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        isBusyUpdateProfile: true,
        responseUpdateProfiledata: undefined,
      };
    case types.POST_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isBusyUpdateProfile: false,
        responseUpdateProfiledata: action.payload,
      };
    case types.POST_UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isBusyUpdateProfile: false,
        errorUpdateProfiledata: action.payload,
      };

    case types.GET_SPORTS_REQUEST:
      return {
        ...state,
        isBusyGetSports: true,
        responseGetSportsdata: undefined,
      };
    case types.GET_SPORTS_SUCCESS:
      return {
        ...state,
        isBusyGetSports: false,
        responseGetSportsdata: action.payload,
      };
    case types.GET_SPORTS_FAILURE:
      return {
        ...state,
        isBusyGetSports: false,
        errorGetSportsdata: action.payload,
      };

    case types.GET_SETTINGS_REQUEST:
      return {
        ...state,
        isBusyGetSettings: true,
        responseGetSettingsdata: undefined,
      };
    case types.GET_SETTINGS_SUCCESS:
      return {
        ...state,
        isBusyGetSettings: false,
        responseGetSettingsdata: action.payload,
      };
    case types.GET_SETTINGS_FAILURE:
      return {
        ...state,
        isBusyGetSettings: false,
        errorGetSettingsdata: action.payload,
      };

    case types.POST_STORE_SETTINGS_REQUEST:
      return {
        ...state,
        isBusyStoreSettings: true,
        responseStoreSettingsdata: undefined,
      };
    case types.POST_STORE_SETTINGS_SUCCESS:
      return {
        ...state,
        isBusyStoreSettings: false,
        responseStoreSettingsdata: action.payload,
      };
    case types.POST_STORE_SETTINGS_FAILURE:
      return {
        ...state,
        isBusyStoreSettings: false,
        errorStoreSettingsdata: action.payload,
      };

    case types.GET_ALL_CONNECTION_REQUEST:
      return {
        ...state,
        isBusyGetAllConnection: true,
        responseGetAllConnectiondata: undefined,
      };
    case types.GET_ALL_CONNECTION_SUCCESS:
      return {
        ...state,
        isBusyGetAllConnection: false,
        responseGetAllConnectiondata: action.payload,
      };
    case types.GET_ALL_CONNECTION_FAILURE:
      return {
        ...state,
        isBusyGetAllConnection: false,
        errorGetAllConnectiondata: action.payload,
      };

    case types.GET_PENDING_CONNECTION_REQUEST:
      return {
        ...state,
        isBusyGetPendingConnection: true,
        responseGetPendingConnectiondata: undefined,
      };
    case types.GET_PENDING_CONNECTION_SUCCESS:
      return {
        ...state,
        isBusyGetPendingConnection: false,
        responseGetPendingConnectiondata: action.payload,
      };
    case types.GET_PENDING_CONNECTION_FAILURE:
      return {
        ...state,
        isBusyGetPendingConnection: false,
        errorGetPendingConnectiondata: action.payload,
      };

    case types.POST_SENT_FRIEND_REQUEST_REQUEST:
      return {
        ...state,
        isBusySentFriendRequest: true,
        responseSentFriendRequestdata: undefined,
      };
    case types.POST_SENT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        isBusySentFriendRequest: false,
        responseSentFriendRequestdata: action.payload,
      };
    case types.POST_SENT_FRIEND_REQUEST_FAILURE:
      return {
        ...state,
        isBusySentFriendRequest: false,
        errorSentFriendRequestdata: action.payload,
      };

    case types.POST_ACCEPT_FRIEND_REQUEST_REQUEST:
      return {
        ...state,
        isBusyAcceptFriendRequest: true,
        responseAcceptFriendRequestdata: undefined,
      };
    case types.POST_ACCEPT_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        isBusyAcceptFriendRequest: false,
        responseAcceptFriendRequestdata: action.payload,
      };
    case types.POST_ACCEPT_FRIEND_REQUEST_FAILURE:
      return {
        ...state,
        isBusyAcceptFriendRequest: false,
        errorAcceptFriendRequestdata: action.payload,
      };

    case types.GET_ALL_USERS_REQUEST:
      return {
        ...state,
        isBusyGetAllUsersRequest: true,
        responseGetAllUsersdata: undefined,
      };
    case types.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        isBusyGetAllUsersRequest: false,
        responseGetAllUsersdata: action.payload,
      };
    case types.GET_ALL_USERS_FAILURE:
      return {
        ...state,
        isBusyGetAllUsersRequest: false,
        errorGetAllUsersdata: action.payload,
      };

    case types.GET_SPORTS_TITLE_REQUEST:
      return {
        ...state,
        isBusyGetSportsTitle: true,
        responseGetSportsTitledata: undefined,
      };
    case types.GET_SPORTS_TITLE_SUCCESS:
      return {
        ...state,
        isBusyGetSportsTitle: false,
        responseGetSportsTitledata: action.payload,
      };
    case types.GET_SPORTS_TITLE_FAILURE:
      return {
        ...state,
        isBusyGetSportsTitle: false,
        errorGetSportsTitledata: action.payload,
      };

    case types.POST_CREATE_SPORT_REQUEST:
      return {
        ...state,
        isBusyCreateSportsRequest: true,
        responseCreateSportsdata: undefined,
      };
    case types.POST_CREATE_SPORT_SUCCESS:
      return {
        ...state,
        isBusyCreateSportsRequest: false,
        responseCreateSportsdata: action.payload,
      };
    case types.POST_CREATE_SPORT_FAILURE:
      return {
        ...state,
        isBusyCreateSportsRequest: false,
        errorCreateSportsdata: action.payload,
      };

    case types.GET_ADDRESS_FROM_GOOGLE_API_REQUEST:
      return {
        ...state,
        isBusyGetAdress: true,
        responseGetAdressdata: undefined,
      };
    case types.GET_ADDRESS_FROM_GOOGLE_API_SUCCESS:
      return {
        ...state,
        isBusyGetAdress: false,
        responseGetAdressdata: action.payload,
      };
    case types.GET_ADDRESS_FROM_GOOGLE_API_FAILURE:
      return {
        ...state,
        isBusyGetAdress: false,
        errorGetAdressdata: action.payload,
      };

    case types.GET_ADDRESS_FROM_PINCODE_REQUEST:
      return {
        ...state,
        isBusyGetAddressFromPincode: true,
        responseGetAddressFromPincodedata: undefined,
      };
    case types.GET_ADDRESS_FROM_PINCODE_SUCCESS:
      return {
        ...state,
        isBusyGetAddressFromPincode: false,
        responseGetAddressFromPincodedata: action.payload,
      };
    case types.GET_ADDRESS_FROM_PINCODE_FAILURE:
      return {
        ...state,
        isBusyGetAddressFromPincode: false,
        errorGetAddressFromPincodedata: action.payload,
      };

    case types.GET_UPCOMING_MATCH_REQUEST:
      return {
        ...state,
        isBusyGetUpcomingMatch: true,
        responseGetUpcomingMatchdata: undefined,
      };
    case types.GET_UPCOMING_MATCH_SUCCESS:
      return {
        ...state,
        isBusyGetUpcomingMatch: false,
        responseGetUpcomingMatchdata: action.payload,
      };
    case types.GET_UPCOMING_MATCH_FAILURE:
      return {
        ...state,
        isBusyGetUpcomingMatch: false,
        errorGetUpcomingMatchdata: action.payload,
      };

    case types.POST_CONFIRM_AND_DECLINE_MATCH_REQUEST:
      return {
        ...state,
        isConfirmAndDeclineMatch: true,
        responseConfirmAndDeclinedata: undefined,
      };
    case types.POST_CONFIRM_AND_DECLINE_MATCH_SUCCESS:
      return {
        ...state,
        isConfirmAndDeclineMatch: false,
        responseConfirmAndDeclinedata: action.payload,
      };
    case types.POST_CONFIRM_AND_DECLINE_MATCH_FAILURE:
      return {
        ...state,
        isConfirmAndDeclineMatch: false,
        errorConfirmAndDeclinedata: action.payload,
      };

    case types.GET_USER_UPCOMING_MATCHES_REQUEST:
      return {
        ...state,
        isBusyGetUserUpcomingMatch: true,
        responseGetUserUpcomingMatchdata: undefined,
      };
    case types.GET_USER_UPCOMING_MATCHES_SUCCESS:
      return {
        ...state,
        isBusyGetUserUpcomingMatch: false,
        responseGetUserUpcomingMatchdata: action.payload,
      };
    case types.GET_USER_UPCOMING_MATCHES_FAILURE:
      return {
        ...state,
        isBusyGetUserUpcomingMatch: false,
        errorGetUserUpcomingMatchdata: action.payload,
      };

    case types.POST_DELETE_MATCH_REQUEST:
      return {
        ...state,
        isBusyDeleteMatch: true,
        responseDeleteMatchdata: undefined,
      };
    case types.POST_DELETE_MATCH_SUCCESS:
      return {
        ...state,
        isBusyDeleteMatch: false,
        responseDeleteMatchdata: action.payload,
      };
    case types.POST_DELETE_MATCH_FAILURE:
      return {
        ...state,
        isBusyDeleteMatch: false,
        errorDeleteMatchdata: action.payload,
      };

   

    case types.GET_START_LOCATION_GOOGLE_API_REQUEST:
      return {
        ...state,
        isBusyGetStartLocation: true,
        responseGetStartLocationdata: undefined,
      };
    case types.GET_START_LOCATION_GOOGLE_API_SUCCESS:
      return {
        ...state,
        isBusyGetStartLocation: false,
        responseGetStartLocationdata: action.payload,
      };
    case types.GET_START_LOCATION_GOOGLE_API_FAILURE:
      return {
        ...state,
        isBusyGetStartLocation: false,
        errorGetStartLocationdata: action.payload,
      };

    case types.POST_FIND_MATCH_REQUEST:
      return {
        ...state,
        isBusyFindMatch: true,
        responseFindMatchdata: undefined,
      };
    case types.POST_FIND_MATCH_SUCCESS:
      return {
        ...state,
        isBusyFindMatch: false,
        responseFindMatchdata: action.payload,
      };
    case types.POST_FIND_MATCH_FAILURE:
      return {
        ...state,
        isBusyFindMatch: false,
        errorFindMatchdata: action.payload,
      };

    case types.POST_REQUEST_TO_PLAY_REQUEST:
      return {
        ...state,
        isBusyRequestToPlayMatch: true,
        responseRequestToPlayMatchdata: undefined,
      };
    case types.POST_REQUEST_TO_PLAY_SUCCESS:
      return {
        ...state,
        isBusyRequestToPlayMatch: false,
        responseRequestToPlayMatchdata: action.payload,
      };
    case types.POST_REQUEST_TO_PLAY_FAILURE:
      return {
        ...state,
        isBusyRequestToPlayMatch: false,
        errorRequestToPlayMatchdata: action.payload,
      };

    case types.GET_USER_LOCATION_REQUEST:
      return {
        ...state,
        isBusyGetUserLocation: true,
        responseBusyGetUserLocationdata: undefined,
      };
    case types.GET_USER_LOCATION_SUCCESS:
      return {
        ...state,
        isBusyGetUserLocation: false,
        responseBusyGetUserLocationdata: action.payload,
      };
    case types.GET_USER_LOCATION_FAILURE:
      return {
        ...state,
        isBusyGetUserLocation: false,
        errorBusyGetUserLocationdata: action.payload,
      };

    case types.POST_INTERESTED_PLAYERS_LIST_REQUEST:
      return {
        ...state,
        isBusyGetInterestedPlayerList: true,
        responseBusyGetInterestedPlayerListdata: undefined,
      };
    case types.POST_INTERESTED_PLAYERS_LIST_SUCCESS:
      return {
        ...state,
        isBusyGetInterestedPlayerList: false,
        responseBusyGetInterestedPlayerListdata: action.payload,
      };
    case types.POST_INTERESTED_PLAYERS_LIST_FAILURE:
      return {
        ...state,
        isBusyGetInterestedPlayerList: false,
        errorBusyGetInterestedPlayerListdata: action.payload,
      };

    case types.POST_EDIT_MATCH_REQUEST:
      return {
        ...state,
        isBusyUpdateMatch: true,
        responseUpdateMatchdata: undefined,
      };
    case types.POST_EDIT_MATCH_SUCCESS:
      return {
        ...state,
        isBusyUpdateMatch: false,
        responseUpdateMatchdata: action.payload,
      };
    case types.POST_EDIT_MATCH_FAILURE:
      return {
        ...state,
        isBusyUpdateMatch: false,
        errorUpdateMatchdata: action.payload,
      };

    case types.POST_GET_MATCH_DETAIL_REQUEST:
      return {
        ...state,
        isBusyGetMatchDetail: true,
        responseGetMatchDetaildata: undefined,
      };
    case types.POST_GET_MATCH_DETAIL_SUCCESS:
      return {
        ...state,
        isBusyGetMatchDetail: false,
        responseGetMatchDetaildata: action.payload,
      };
    case types.POST_GET_MATCH_DETAIL_FAILURE:
      return {
        ...state,
        isBusyGetMatchDetail: false,
        errorGetMatchDetaildata: action.payload,
      };

    case types.POST_INVITED_PLAYER_REQUEST:
      return {
        ...state,
        isBusyInvitedPlayer: true,
        responseInvitedPlayerdata: undefined,
      };
    case types.POST_INVITED_PLAYER_SUCCESS:
      return {
        ...state,
        isBusyInvitedPlayer: false,
        responseInvitedPlayerdata: action.payload,
      };
    case types.POST_INVITED_PLAYER_FAILURE:
      return {
        ...state,
        isBusyInvitedPlayer: false,
        errorInvitedPlayerdata: action.payload,
      };

    case types.POST_REMATCH_REQUEST:
      return {
        ...state,
        isBusyRematch: true,
        responseRematchdata: undefined,
      };
    case types.POST_REMATCH_SUCCESS:
      return {
        ...state,
        isBusyRematch: false,
        responseRematchdata: action.payload,
      };
    case types.POST_REMATCH_FAILURE:
      return {
        ...state,
        isBusyRematch: false,
        errorRematchdata: action.payload,
      };

    case types.GET_SPORTS_TITLE_AND_VALUE_REQUEST:
      return {
        ...state,
        isBusyGetTitleAndCategory: true,
        responseGetTitleAndCategorydata: undefined,
      };
    case types.GET_SPORTS_TITLE_AND_VALUE_SUCCESS:
      return {
        ...state,
        isBusyGetTitleAndCategory: false,
        responseGetTitleAndCategorydata: action.payload,
      };
    case types.GET_SPORTS_TITLE_AND_VALUE_FAILURE:
      return {
        ...state,
        isBusyGetTitleAndCategory: false,
        errorGetTitleAndCategorydata: action.payload,
      };

    case types.POST_DELETE_ACCOUNT_REQUEST:
      return {
        ...state,
        isBusyDeleteAccount: true,
        responseDeleteAccountdata: undefined,
      };
    case types.POST_DELETE_ACCOUNT_SUCCESS:
      return {
        ...state,
        isBusyDeleteAccount: false,
        responseDeleteAccountdata: action.payload,
      };
    case types.POST_DELETE_ACCOUNT_FAILURE:
      return {
        ...state,
        isBusyDeleteAccount: false,
        errorDeleteAccountdata: action.payload,
      };

      case types.POST_DELETE_CONNECTION_REQUEST:
        return {
          ...state,
          isBusyDeleteConnection: true,
          responseDeleteConnectiondata: undefined,
        };
      case types.POST_DELETE_CONNECTION_SUCCESS:
        return {
          ...state,
          isBusyDeleteConnection: false,
          responseDeleteConnectiondata: action.payload,
        };
      case types.POST_DELETE_CONNECTION_FAILURE:
        return {
          ...state,
          isBusyDeleteConnection: false,
          errorDeleteConnectiondata: action.payload,
        };
    default:
      return state;
  }
}
