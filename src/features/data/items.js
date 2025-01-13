import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    item: null,
};

const itemSlice = createSlice({
    name: 'noteItems',
    initialState,
    reducers: {
        addNoteItems: (state ,action) =>{
            state.item = action.payload;
        },
    },
});

export const {addNoteItems} = itemSlice.actions;
export default itemSlice.reducer;