import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/Login";
import searchReducer from "../features/search/searchQuerry";
import addFormToggleSlice from "../features/toggleForm/toggleAddForm";
import calendarStateSlice from "../features/toggleForm/toggleCalendar";
import itemSlice from '../features/data/items'

const store = configureStore({
  reducer: {
    user: authReducer,
    search: searchReducer,
    toggleAddForm: addFormToggleSlice,
    toggleCalendar: calendarStateSlice,
    updateNoteItems: itemSlice,
  },
});

export default store;
