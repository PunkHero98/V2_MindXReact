// Trong file Redux - Login.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("sessionID");
      localStorage.removeItem("sessionExpiry");
      state.user = "logged_out";
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
