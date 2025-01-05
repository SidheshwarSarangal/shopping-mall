import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const offersSlice = createSlice({
    name: "offers",
    initialState,
    reducers: {
        setoffers(state, action) {
            state.list = action.payload;
        },
    },
});

export const { setoffers } = offersSlice.actions;
export default offersSlice.reducer;
