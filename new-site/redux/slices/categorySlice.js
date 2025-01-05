import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setcategory(state, action) {
            state.list = action.payload;
        },
    },
});

export const { setcategory } = categorySlice.actions;
export default categorySlice.reducer;
