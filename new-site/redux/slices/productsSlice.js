import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setproducts(state, action) {
            state.list = action.payload;
        },
    },
});

export const { setproducts } = productsSlice.actions;
export default productsSlice.reducer;
