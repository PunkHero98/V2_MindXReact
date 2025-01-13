import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addFormStage: false,
};

const addFormToggleSlice = createSlice({
  name: "addFormToggle",
  initialState,
  reducers: {
    openAddForm: (state) => {
      state.addFormStage = true;
    },
    closeAddForm: (state) => {
      state.addFormStage = false;
    },
  },
});
export const { openAddForm, closeAddForm } = addFormToggleSlice.actions;
export default addFormToggleSlice.reducer;
