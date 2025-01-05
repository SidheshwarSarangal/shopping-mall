import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const floorsSlice = createSlice({
    name: "floors",
    initialState,
    reducers: {
        setfloors(state, action) {
            state.list = action.payload;
        },
    },
});

export const { setfloors } = floorsSlice.actions;
export default floorsSlice.reducer;
