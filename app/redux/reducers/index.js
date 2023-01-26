import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import AppReducer from "./AppReducer";
import ChatReducer from './ChatReducer';

const index = combineReducers({
  auth: AuthReducer,
  app: AppReducer,
  chat: ChatReducer,
});

export default index;
