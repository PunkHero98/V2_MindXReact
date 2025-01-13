import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calendarState: false,
};

const calendarStateSlice = createSlice({
  name: "toggleCalendar",
  initialState,
  reducers: {
    openCalendar: (state) => {
      state.calendarState = true;
    },
    closeCalendar: (state) => {
      state.calendarState = false;
    },
  },
});

export const { openCalendar, closeCalendar } = calendarStateSlice.actions;
export default calendarStateSlice.reducer;
