import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const shopsSlice = createSlice({
    name: "shops",
    initialState,
    reducers: {
        setshops(state, action) {
            state.list = action.payload;
        },
    },
});

export const { setshops } = shopsSlice.actions;
export default shopsSlice.reducer;
