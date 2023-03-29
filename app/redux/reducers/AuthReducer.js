import * as types from "../actions/ActionTypes";

const initialState = {
  currentUser: undefined,
  userSportCategory: undefined,
  notificationData: undefined,

  isBusyLogin: false,
  responseLogin: undefined,
  errorLogin: undefined,

  isBusyRegister: false,
  responseRegister: undefined,
  errorRegister: undefined,

  isBusyUserdata: false,
  responseUserdata: undefined,
  errorUserdata: undefined,

  isBusyForgotPass: false,
  responseForgotPassdata: undefined,
  errorForgotPassdata: undefined,

  isBusyLogout: false,
  responseLogoutdata: undefined,
  errorLogoutdata: undefined,

  isBusyUpdate: false,
  responseUpdatedata: undefined,
  errorUpdatedata: undefined,

  isBusyRefreshToken: false,
  responseRefreshTokendata: undefined,
  errorRefreshTokendata: undefined,

  isBusyUserExists: false,
  responseUserExistsdata: undefined,
  errorUserExistsdata: undefined,

  isBusySendOTP: false,
  responseSendOTPdata: undefined,
  errorSendOTPdata: undefined,
};

export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case types.SET_NOTIFICATION_DATA:
      return {
        ...state,
        notificationData: action.payload,
      };
    case types.POST_LOGIN_REQUEST:
      return {
        ...state,
        isBusyLogin: true,
        responseLogin: undefined,
      };
    case types.POST_LOGIN_SUCCESS:
      return {
        ...state,
        isBusyLogin: false,
        responseLogin: action.payload,
      };
    case types.POST_LOGIN_FAILURE:
      return {
        ...state,
        isBusyLogin: false,
        errorLogin: action.payload,
      };

    case types.POST_REGISTER_REQUEST:
      return {
        ...state,
        isBusyRegister: true,
        responseRegister: undefined,
      };
    case types.POST_REGISTER_SUCCESS:
      return {
        ...state,
        isBusyRegister: false,
        responseRegister: action.payload,
      };
    case types.POST_REGISTER_FAILURE:
      return {
        ...state,
        isBusyRegister: false,
        errorRegister: action.payload,
      };

    case types.GET_USER_PROFILE_REQUEST:
      return {
        ...state,
        isBusyUserdata: true,
        responseUserdata: undefined,
      };
    case types.GET_USER_PROFILE_SUCCESS:
      let getcurrentuser;
      let getuserSportCategory;
      if (action.payload.user) {
        getcurrentuser = action.payload.user;
        getuserSportCategory = action.payload.userSportCategory;
      }
      return {
        ...state,
        isBusyUserdata: false,
        responseUserdata: action.payload,
        currentUser: getcurrentuser,
        userSportCategory: getuserSportCategory,
      };
    case types.GET_USER_PROFILE_FAILURE:
      return {
        ...state,
        isBusyUserdata: false,
        errorUserdata: action.payload,
      };

    case types.POST_FORGOTPASS_REQUEST:
      return {
        ...state,
        isBusyForgotPass: true,
        responseForgotPassdata: undefined,
      };
    case types.POST_FORGOTPASS_SUCCESS:
      return {
        ...state,
        isBusyForgotPass: false,
        responseForgotPassdata: action.payload,
      };
    case types.POST_FORGOTPASS_FAILURE:
      return {
        ...state,
        isBusyForgotPass: false,
        errorForgotPassdata: action.payload,
      };

    case types.POST_LOGOUT_REQUEST:
      return {
        ...state,
        isBusyLogout: true,
        responseLogoutdata: undefined,
      };
    case types.POST_LOGOUT_SUCCESS:
      return {
        ...state,
        isBusyLogout: false,
        responseLogoutdata: action.payload,
        responseLogin: undefined,
        responseUserdata: undefined,
      };
    case types.POST_LOGOUT_FAILURE:
      return {
        ...state,
        isBusyLogout: false,
        errorLogoutdata: action.payload,
      };

    case types.POST_UPDATEPASS_REQUEST:
      return {
        ...state,
        isBusyUpdate: true,
        responseUpdatedata: undefined,
      };
    case types.POST_UPDATEPASS_SUCCESS:
      return {
        ...state,
        isBusyUpdate: false,
        responseUpdatedata: action.payload,
      };
    case types.POST_UPDATEPASS_FAILURE:
      return {
        ...state,
        isBusyUpdate: false,
        errorUpdatedata: action.payload,
      };

    case types.POST_REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        isBusyRefreshToken: true,
        responseRefreshTokendata: undefined,
      };
    case types.POST_REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        isBusyRefreshToken: false,
        responseRefreshTokendata: action.payload,
      };
    case types.POST_REFRESH_TOKEN_FAILURE:
      return {
        ...state,
        isBusyRefreshToken: false,
        errorRefreshTokendata: action.payload,
      };

    case types.GET_CHECK_USER_EXIST_OR_NOT_REQUEST:
      return {
        ...state,
        isBusyUserExists: true,
        responseUserExistsdata: undefined,
      };
    case types.GET_CHECK_USER_EXIST_OR_NOT_SUCCESS:
      return {
        ...state,
        isBusyUserExists: false,
        responseUserExistsdata: action.payload,
      };
    case types.GET_CHECK_USER_EXIST_OR_NOT_FAILURE:
      return {
        ...state,
        isBusyUserExists: false,
        errorUserExistsdata: action.payload,
      };

    case types.POST_SEND_OTP_REQUEST:
      return {
        ...state,
        isBusySendOTP: true,
        responseSendOTPdata: undefined,
      };
    case types.POST_SEND_OTP_SUCCESS:
      return {
        ...state,
        isBusySendOTP: false,
        responseSendOTPdata: action.payload,
      };
    case types.POST_SEND_OTP_FAILURE:
      return {
        ...state,
        isBusySendOTP: false,
        responseSendOTPdata: action.payload,
      };

    default:
      return state;
  }
}
