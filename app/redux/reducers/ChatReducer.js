import * as types from "../actions/ActionTypes";

const initialState = {
  notificationData: undefined,

  isBusySearchUsers: false,
  responseSearchUsers: undefined,
  errorSearchUsers: undefined,

  isBusyChatList: false,
  responseChatList: undefined,
  errorChatList: undefined,

  isBusyChatDetail: false,
  responseChatDetail: undefined,
  errorChatDetail: undefined,

  isBusyCreateChatRoom: false,
  responseCreateChatRoom: undefined,
  errorCreateChatRoom: undefined,

  isBusySendMessage: false,
  responseSendMessage: undefined,
  errorSendMessage: undefined,

  isBusyDeleteMessage: false,
  responseDeleteMessage: undefined,
  errorDeleteMessage: undefined,

  isBusyArchiveMessage: false,
  responseArchiveMessage: undefined,
  errorArchiveMessage: undefined,

  isBusyBlockUser: false,
  responseBlockUser: undefined,
  errorBlockUser: undefined,

  isBusyArchiveChatlist: false,
  responseArchiveChatlist: undefined,
  errorArchiveChatlist: undefined,

  isBusyGetBlockedChatlist: false,
  responseGetBlockedChatlist: undefined,
  errorGetBlockedChatlist: undefined,
};

export default function ChatReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_NOTIFICATION_DATA:
      return {
        ...state,
        notificationData: action.payload,
      };
      
    case types.GET_CHAT_LIST_REQUEST:
      return {
        ...state,
        isBusyChatList: true,
        responseChatList: undefined,
      };
    case types.GET_CHAT_LIST_SUCCESS:
      return {
        ...state,
        isBusyChatList: false,
        responseChatList: action.payload,
      };
    case types.GET_CHAT_LIST_FAILURE:
      return {
        ...state,
        isBusyChatList: false,
        errorChatList: action.payload,
      };
    case types.GET_CHAT_DETAIL_REQUEST:
      return {
        ...state,
        isBusyChatDetail: true,
        responseChatDetail: undefined,
      };
    case types.GET_CHAT_DETAIL_SUCCESS:
      return {
        ...state,
        isBusyChatDetail: false,
        responseChatDetail: action.payload,
      };
    case types.GET_CHAT_DETAIL_FAILURE:
      return {
        ...state,
        isBusyChatDetail: false,
        errorChatDetail: action.payload,
      };
    case types.POST_SEARCH_USERS_REQUEST:
      return {
        ...state,
        isBusySearchUsers: true,
        responseChatDetail: undefined,
      };
    case types.POST_SEARCH_USERS_SUCCESS:
      return {
        ...state,
        isBusySearchUsers: false,
        responseSearchUsers: action.payload,
      };
    case types.POST_SEARCH_USERS_FAILURE:
      return {
        ...state,
        isBusySearchUsers: false,
        errorSearchUsers: action.payload,
      };
    case types.POST_CREATE_CHATROOM_REQUEST:
      return {
        ...state,
        isBusyCreateChatRoom: true,
        responseCreateChatRoom: undefined,
      };
    case types.POST_CREATE_CHATROOM_SUCCESS:
      return {
        ...state,
        isBusyCreateChatRoom: false,
        responseCreateChatRoom: action.payload,
      };
    case types.POST_CREATE_CHATROOM_FAILURE:
      return {
        ...state,
        isBusyCreateChatRoom: false,
        errorCreateChatRoom: action.payload,
      };
    case types.POST_SEND_MESSAGE_REQUEST:
      return {
        ...state,
        isBusySendMessage: true,
        responseSendMessage: undefined,
      };
    case types.POST_SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        isBusySendMessage: false,
        responseSendMessage: action.payload,
      };
    case types.POST_SEND_MESSAGE_FAILURE:
      return {
        ...state,
        isBusySendMessage: false,
        errorSendMessage: action.payload,
      };
    case types.POST_DELETE_MESSAGE_REQUEST:
      return {
        ...state,
        isBusyDeleteMessage: true,
        responseDeleteMessage: undefined,
      };
    case types.POST_DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        isBusyDeleteMessage: false,
        responseDeleteMessage: action.payload,
      };
    case types.POST_DELETE_MESSAGE_FAILURE:
      return {
        ...state,
        isBusyDeleteMessage: false,
        errorDeleteMessage: action.payload,
      };
    case types.POST_ARCHIVE_CHAT_REQUEST:
      return {
        ...state,
        isBusyArchiveMessage: true,
        responseArchiveMessage: undefined,
      };
    case types.POST_ARCHIVE_CHAT_SUCCESS:
      return {
        ...state,
        isBusyArchiveMessage: false,
        responseArchiveMessage: action.payload,
      };
    case types.POST_ARCHIVE_CHAT_FAILURE:
      return {
        ...state,
        isBusyArchiveMessage: false,
        errorArchiveMessage: action.payload,
      };
    case types.POST_BLOCK_USER_REQUEST:
      return {
        ...state,
        isBusyBlockUser: true,
        responseBlockUser: undefined,
      };
    case types.POST_BLOCK_USER_SUCCESS:
      return {
        ...state,
        isBusyBlockUser: false,
        responseBlockUser: action.payload,
      };
    case types.POST_BLOCK_USER_FAILURE:
      return {
        ...state,
        isBusyBlockUser: false,
        errorBlockUser: action.payload,
      };
      case types.GET_ARCIVE_CHAT_LIST_REQUEST:
        return {
          ...state,
          isBusyArchiveChatlist: true,
          responseArchiveChatlist: undefined,
        };
      case types.GET_ARCIVE_CHAT_LIST_SUCCESS:
        return {
          ...state,
          isBusyArchiveChatlist: false,
          responseArchiveChatlist: action.payload,
        };
      case types.GET_ARCIVE_CHAT_LIST_FAILURE:
        return {
          ...state,
          isBusyArchiveChatlist: false,
          errorArchiveChatlist: action.payload,
        };
        case types.GET_BLOCKED_LIST_REQUEST:
          return {
            ...state,
            isBusyGetBlockedChatlist: true,
            responseGetBlockedChatlist: undefined,
          };
        case types.GET_BLOCKED_LIST_SUCCESS:
          return {
            ...state,
            isBusyGetBlockedChatlist: false,
            responseGetBlockedChatlist: action.payload,
          };
        case types.GET_BLOCKED_LIST_FAILURE:
          return {
            ...state,
            isBusyGetBlockedChatlist: false,
            errorGetBlockedChatlist: action.payload,
          };
    default:
      return state;
  }
}
