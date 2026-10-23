import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Reducers
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/products/productSlice';
import orderReducer from './features/orders/orderSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'] // Only persist auth and cart
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  orders: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values like functions in actions
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
