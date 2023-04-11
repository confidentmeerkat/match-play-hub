import {
  postImageRequest,
  makeGetHeaders,
  postRequestWithTokenandData,
  makePostHeaderswithToken,
} from "../../networks/ApiRequest";
import * as types from "./ActionTypes";
import ApiUrls from "../../networks/ApiUrls";

export const doSetNotificationData = (text) => {
  return (dispatch) => {
    dispatch({ type: types.SET_NOTIFICATION_DATA, payload: text });
  };
};

export const doSetCurrentUserData = (text) => {
  return (dispatch) => {
    dispatch({ type: types.SET_CURRENT_USER, payload: text });
  };
};

export const doUpdateProfile = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_UPDATE_PROFILE_REQUEST });
      const result = await postImageRequest(ApiUrls.UPDATE_PROFILES, body);
      dispatch({ type: types.POST_UPDATE_PROFILE_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_UPDATE_PROFILE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetSports = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_SPORTS_REQUEST });
      const result = await makeGetHeaders(ApiUrls.GET_SPORTS);
      dispatch({ type: types.GET_SPORTS_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_SPORTS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doGetSettings = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_SETTINGS_REQUEST });
      const result = await makeGetHeaders(ApiUrls.GET_SETTINGS);
      dispatch({ type: types.GET_SETTINGS_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_SETTINGS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doStoreSettings = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_STORE_SETTINGS_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.STORE_SETTINGS, body);
      dispatch({ type: types.POST_STORE_SETTINGS_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_STORE_SETTINGS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doGetAllConnection = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_ALL_CONNECTION_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.GET_ALL_CONNECTION, body);
      dispatch({ type: types.GET_ALL_CONNECTION_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_ALL_CONNECTION_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doGetPendingConnection = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_PENDING_CONNECTION_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.GET_PENDING_CONNECTION, body);
      dispatch({ type: types.GET_PENDING_CONNECTION_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_PENDING_CONNECTION_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doSentFriendRequest = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_SENT_FRIEND_REQUEST_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.SENT_FRIEND_REQUEST, body);
      dispatch({
        type: types.POST_SENT_FRIEND_REQUEST_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_SENT_FRIEND_REQUEST_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doAcceptFriendRequest = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_ACCEPT_FRIEND_REQUEST_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.ACCEPT_FRIEND_REQUEST, body);
      dispatch({
        type: types.POST_ACCEPT_FRIEND_REQUEST_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_ACCEPT_FRIEND_REQUEST_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetAllUsers = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_ALL_USERS_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.GET_ALL_USERS, body);
      dispatch({ type: types.GET_ALL_USERS_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_ALL_USERS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetSportsTitle = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_SPORTS_TITLE_REQUEST });
      const result = await makeGetHeaders(ApiUrls.GET_SPORT_TITLES);
      dispatch({ type: types.GET_SPORTS_TITLE_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_SPORTS_TITLE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doCreateSports = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_CREATE_SPORT_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.CREATE_SPORT, body);
      dispatch({ type: types.POST_CREATE_SPORT_SUCCESS, payload: result });
      console.log("result :", result);
      return result;
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.POST_CREATE_SPORT_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doGetUpcomingMatch = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_UPCOMING_MATCH_REQUEST });
      const result = await makePostHeaderswithToken(ApiUrls.GET_UPCOMING_MATCH);
      dispatch({ type: types.GET_UPCOMING_MATCH_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_UPCOMING_MATCH_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doConfirmandDeclineMatch = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_CONFIRM_AND_DECLINE_MATCH_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.CONFIRM_AND_DECLINE_MATCH, body);
      dispatch({
        type: types.POST_CONFIRM_AND_DECLINE_MATCH_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_CONFIRM_AND_DECLINE_MATCH_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetUserUpcomingMatch = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_USER_UPCOMING_MATCHES_REQUEST });
      const result = await makeGetHeaders(ApiUrls.GET_USER_UPCOMING_MATCHES);
      dispatch({
        type: types.GET_USER_UPCOMING_MATCHES_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_USER_UPCOMING_MATCHES_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doDeleteMatch = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_DELETE_MATCH_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.DELETE_MATCH, body);
      dispatch({ type: types.POST_DELETE_MATCH_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_DELETE_MATCH_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doFindMatch = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_FIND_MATCH_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.FIND_MATCH, body);
      dispatch({ type: types.POST_FIND_MATCH_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_FIND_MATCH_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doRequestToPlayMatch = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_REQUEST_TO_PLAY_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.REQUEST_TO_PLAY, body);
      dispatch({ type: types.POST_REQUEST_TO_PLAY_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_REQUEST_TO_PLAY_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetUserLocation = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_USER_LOCATION_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.GET_USER_LOCATION, body);
      dispatch({ type: types.GET_USER_LOCATION_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_USER_LOCATION_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetInterestedPlayersList = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_INTERESTED_PLAYERS_LIST_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.INTERESTED_PLAYERS_LIST, body);
      dispatch({
        type: types.POST_INTERESTED_PLAYERS_LIST_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_INTERESTED_PLAYERS_LIST_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doPostUpdateMatch = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_EDIT_MATCH_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.UPDATE_MATCH, body);
      dispatch({ type: types.POST_EDIT_MATCH_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_EDIT_MATCH_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doGetMatchDetail = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_GET_MATCH_DETAIL_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.GET_MATCH_DETAIL, body);
      dispatch({ type: types.POST_GET_MATCH_DETAIL_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_GET_MATCH_DETAIL_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doinvitedPlayerList = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_INVITED_PLAYER_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.INVITED_PLAYER, body);
      dispatch({ type: types.POST_INVITED_PLAYER_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_INVITED_PLAYER_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doCreateRematch = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_REMATCH_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.REMATCH, body);
      dispatch({ type: types.POST_REMATCH_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_REMATCH_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetSportsTitleAndCateGory = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_SPORTS_TITLE_AND_VALUE_REQUEST });
      const result = await makeGetHeaders(ApiUrls.GET_SPORTS_TITLE_AND_CATEGORY);
      dispatch({ type: types.GET_SPORTS_TITLE_AND_VALUE_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_SPORTS_TITLE_AND_VALUE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doDeleteAccount = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_DELETE_ACCOUNT_REQUEST });
      const result = await makePostHeaderswithToken(ApiUrls.DELETE_ACCOUNT);
      dispatch({ type: types.POST_DELETE_ACCOUNT_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_DELETE_ACCOUNT_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doDeleteConnection = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_DELETE_CONNECTION_REQUEST });
      const result = await postRequestWithTokenandData(ApiUrls.DELETE_CONNECTION, body);
      dispatch({ type: types.POST_DELETE_CONNECTION_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_DELETE_CONNECTION_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
