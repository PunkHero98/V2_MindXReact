import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuerry: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuerry: (state, action) => {
      state.searchQuerry = action.payload;
    },
  },
});

export const { setSearchQuerry } = searchSlice.actions;

export default searchSlice.reducer;
