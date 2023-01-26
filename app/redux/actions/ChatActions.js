import {
  makePostHeaderswithToken,
  postImageRequest,
  makeGetHeaders,
  postRequestWithTokenandData,
} from "../../networks/ApiRequest";
import * as types from "./ActionTypes";
import ApiUrls from "../../networks/ApiUrls";

export const doGetChatList = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_CHAT_LIST_REQUEST });
      const result = await postRequestWithTokenandData(
        ApiUrls.GET_CHAT_LIST,
        body
      );
      dispatch({ type: types.GET_CHAT_LIST_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_CHAT_LIST_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetChatDetail = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_CHAT_DETAIL_REQUEST });
      const result = await postRequestWithTokenandData(
        ApiUrls.CHAT_DETAIL,
        body
      );
      dispatch({ type: types.GET_CHAT_DETAIL_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_CHAT_DETAIL_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doPostSearchUsers = (body) => {
  return async (dispatch) => {
    try {
      let url = `${ApiUrls.SEARCH_USERS}`;
      dispatch({ type: types.POST_SEARCH_USERS_REQUEST });
      const result = await postRequestWithTokenandData(url, body);
      dispatch({ type: types.POST_SEARCH_USERS_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_SEARCH_USERS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doPostCreateChatRoom = (body) => {
  return async (dispatch) => {
    try {
      let url = `${ApiUrls.CREATE_CHATROOM}`;
      dispatch({ type: types.POST_CREATE_CHATROOM_REQUEST });
      const result = await makePostHeaderswithToken(url, body);
      dispatch({ type: types.POST_CREATE_CHATROOM_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_CREATE_CHATROOM_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doPostSendMessage = (body) => {
  return async (dispatch) => {
    try {
      let url = `${ApiUrls.SEND_MESSAGE}`;
      dispatch({ type: types.POST_SEND_MESSAGE_REQUEST });
      const result = await postImageRequest(url, body);
      dispatch({ type: types.POST_SEND_MESSAGE_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_SEND_MESSAGE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doDeleteMessages = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_DELETE_MESSAGE_REQUEST });
      const result = await postRequestWithTokenandData(
        ApiUrls.DELETE_CHAT,
        body
      );
      dispatch({ type: types.POST_DELETE_MESSAGE_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_DELETE_MESSAGE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doPostSendMedia = (field, imageUrl, body) => {
  return async (dispatch) => {
    try {
      let url = `${ApiUrls.SEND_MESSAGE}`;
      dispatch({ type: types.POST_SEND_MESSAGE_REQUEST });
      const result = await postImageRequest(
        ApiUrls.SEND_MESSAGE,
        field,
        imageUrl,
        body
      );
      dispatch({ type: types.POST_SEND_MESSAGE_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_SEND_MESSAGE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doArchiveMessages = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_ARCHIVE_CHAT_REQUEST });
      const result = await postRequestWithTokenandData(
        ApiUrls.ARCHIVE_CHAT,
        body
      );
      dispatch({ type: types.POST_ARCHIVE_CHAT_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_ARCHIVE_CHAT_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doBlockUser = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_BLOCK_USER_REQUEST });
      const result = await postRequestWithTokenandData(
        ApiUrls.BLOCK_USER,
        body
      );
      dispatch({ type: types.POST_BLOCK_USER_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_BLOCK_USER_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetArchiveChat = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_ARCIVE_CHAT_LIST_REQUEST });
      const result = await postRequestWithTokenandData(
        ApiUrls.GET_ARCIVE_CHAT_LIST,
        body
      );
      dispatch({ type: types.GET_ARCIVE_CHAT_LIST_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_ARCIVE_CHAT_LIST_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doGetBlockedChatList = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_BLOCKED_LIST_REQUEST });
      const result = await postRequestWithTokenandData(
        ApiUrls.GET_BLOCK_CHAT_LIST,
        body
      );
      dispatch({ type: types.GET_BLOCKED_LIST_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_BLOCKED_LIST_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
