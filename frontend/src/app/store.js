import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import autocompleteReducer from '../slices/autocompleteSlice';
import userInfoReducer from '../slices/userInfoSlice';
import cartSlice from '../slices/cartSlice';
import orderReducer from '../slices/orderSlice';
import paymentReducer from '../slices/paymentSlice';
import { apiSlice } from '../slices/apiSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSlice.reducer,
    auth: authReducer,
    userAutocomplete: autocompleteReducer,
    userInfo: userInfoReducer,
    payment: paymentReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
