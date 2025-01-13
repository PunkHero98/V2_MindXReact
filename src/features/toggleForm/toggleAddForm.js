import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addFormStage: false,
};

const addFormToggleSlice = createSlice({
  name: "addFormToggle",
  initialState,
  reducers: {
    openAddForm: (state , action) => {
      state.addFormStage = action.payload;
    },
    closeAddForm: (state) => {
      state.addFormStage = false;
    },
  },
});
export const { openAddForm, closeAddForm } = addFormToggleSlice.actions;
export default addFormToggleSlice.reducer;
