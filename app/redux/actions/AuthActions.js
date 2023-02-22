import {
  postRequest,
  makeGetHeaders,
  makePostHeaderswithToken,
} from "../../networks/ApiRequest";
import * as types from "./ActionTypes";
import ApiUrls from "../../networks/ApiUrls";

export const doSetCurrentUserData = (text) => {
  return (dispatch) => {
    dispatch({ type: types.SET_CURRENT_USER, payload: text });
  };
};

export const doLogin = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_LOGIN_REQUEST });
      const result = await postRequest(ApiUrls.LOGIN, body);
      dispatch({ type: types.POST_LOGIN_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_LOGIN_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doFBLogin = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_LOGIN_REQUEST });
      const result = await postRequest(ApiUrls.FBLOGIN, body);
      dispatch({ type: types.POST_LOGIN_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_LOGIN_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doSendOTP = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_SEND_OTP_REQUEST });
      const result = await postRequest(ApiUrls.SEND_OTP, body);
      dispatch({ type: types.POST_SEND_OTP_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_SEND_OTP_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doRegister = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_REGISTER_REQUEST });
      const result = await postRequest(ApiUrls.REGISTER, body);
      dispatch({ type: types.POST_REGISTER_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_REGISTER_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetUserExists = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_CHECK_USER_EXIST_OR_NOT_REQUEST });
      const result = await makeGetHeaders(ApiUrls.CHECK_USER_EXIST_OR_NOT);
      dispatch({
        type: types.GET_CHECK_USER_EXIST_OR_NOT_SUCCESS,
        payload: result,
      });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_CHECK_USER_EXIST_OR_NOT_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doGetUser = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_USER_PROFILE_REQUEST });
      const result = await makeGetHeaders(ApiUrls.PROFILE);
      dispatch({ type: types.GET_USER_PROFILE_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.GET_USER_PROFILE_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doForgotPassword = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_FORGOTPASS_REQUEST });
      const result = await postRequest(ApiUrls.FORGOTPASS, body);
      dispatch({ type: types.POST_FORGOTPASS_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_FORGOTPASS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doLogoutUser = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_LOGOUT_REQUEST });
      const result = await makePostHeaderswithToken(ApiUrls.LOGOUT);
      dispatch({ type: types.POST_LOGOUT_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_LOGOUT_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
export const doUpdatePassword = (body) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_UPDATEPASS_REQUEST });
      const result = await postRequest(ApiUrls.UPDATEPASS, body);
      dispatch({ type: types.POST_UPDATEPASS_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_UPDATEPASS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};

export const doRefreshToken = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.POST_REFRESH_TOKEN_REQUEST });
      const result = await makePostHeaderswithToken(ApiUrls.REFRESH_TOKEN);
      dispatch({ type: types.POST_REFRESH_TOKEN_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({
        type: types.POST_REFRESH_TOKEN_FAILURE,
        payload: error,
      });
      throw error;
    }
  };
};
