import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/Login";
import searchReducer from "../features/search/searchQuerry";
import addFormToggleSlice from "../features/toggleForm/toggleAddForm";
import calendarStateSlice from "../features/toggleForm/toggleCalendar";

const store = configureStore({
  reducer: {
    user: authReducer,
    search: searchReducer,
    toggleAddForm: addFormToggleSlice,
    toggleCalendar: calendarStateSlice,
  },
});

export default store;
