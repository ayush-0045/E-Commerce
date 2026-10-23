import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Helper function to get cart items from localStorage
const getCartItemsFromStorage = () => {
  const cartItems = localStorage.getItem('cartItems');
  return cartItems ? JSON.parse(cartItems) : [];
};

// Helper function to save cart items to localStorage
const saveCartItemsToStorage = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

const initialState = {
  cartItems: getCartItemsFromStorage(),
  shippingAddress: {},
  paymentMethod: 'PayPal',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
        toast.info('Cart updated');
      } else {
        state.cartItems = [...state.cartItems, item];
        toast.success('Product added to cart');
      }
      saveCartItemsToStorage(state.cartItems);
    },
    updateCartItemQty: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.cartItems.find((x) => x.product === productId);
      
      if (item) {
        item.qty = Number(qty);
        saveCartItemsToStorage(state.cartItems);
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      saveCartItemsToStorage(state.cartItems);
      toast.success('Product removed from cart');
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCartItemsToStorage([]);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      saveCartItemsToStorage([]);
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
  resetCart,
  updateCartItemQty,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartItemsCount = (state) =>
  state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectShippingAddress = (state) => state.cart.shippingAddress;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;
