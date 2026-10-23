import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sample initial state
const initialState = {
  orders: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedOrder: null,
};

// Async thunks
// In a real app, these would make API calls

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  // Replace with actual API call
  const response = await fetch('/api/orders');
  const data = await response.json();
  return data;
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (orderId) => {
  // Replace with actual API call
  const response = await fetch(`/api/orders/${orderId}`);
  const data = await response.json();
  return data;
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ orderId, status }) => {
  // Replace with actual API call
  const response = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  return data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Sync reducers can be added here if needed
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const order = state.orders.find(order => order.id === id);
        if (order) {
          order.status = status;
        }
        if (state.selectedOrder && state.selectedOrder.id === id) {
          state.selectedOrder.status = status;
        }
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;

export const selectAllOrders = (state) => state.orders.orders;
export const selectOrderById = (state, orderId) => 
  state.orders.orders.find(order => order.id === orderId);
export const getOrdersStatus = (state) => state.orders.status;
export const getOrdersError = (state) => state.orders.error;
export const getSelectedOrder = (state) => state.orders.selectedOrder;

export default orderSlice.reducer;
