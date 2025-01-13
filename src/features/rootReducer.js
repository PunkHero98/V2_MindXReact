import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./auth/Login";

const rootReducer = combineReducers({
  authLogin: authReducer,
});

export default rootReducer;
