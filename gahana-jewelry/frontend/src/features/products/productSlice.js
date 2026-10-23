import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sample initial state
const initialState = {
  products: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunks
// In a real app, these would make API calls

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  // Replace with actual API call
  const response = await fetch('/api/products');
  const data = await response.json();
  return data;
});

export const addNewProduct = createAsyncThunk('products/addNewProduct', async (product) => {
  // Replace with actual API call
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  return data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product) => {
  // Replace with actual API call
  const response = await fetch(`/api/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  return data;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId) => {
  // Replace with actual API call
  await fetch(`/api/products/${productId}`, { method: 'DELETE' });
  return productId;
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Sync reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const { id } = action.payload;
        const existingProductIndex = state.products.findIndex(product => product.id === id);
        if (existingProductIndex !== -1) {
          state.products[existingProductIndex] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload;
        state.products = state.products.filter(product => product.id !== productId);
      });
  },
});

export const selectAllProducts = (state) => state.products.products;
export const getProductsStatus = (state) => state.products.status;
export const getProductsError = (state) => state.products.error;

export default productSlice.reducer;
