import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import floorsReducer from "./slices/floorsSlice";
import offersReducer from "./slices/offersSlice";
import productsReducer from "./slices/productsSlice";
import shopsReducer from "./slices/shopsSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoryReducer,
        floors: floorsReducer,
        offers: offersReducer,
        products: productsReducer,
        shops: shopsReducer,
    },
});

export default store;
