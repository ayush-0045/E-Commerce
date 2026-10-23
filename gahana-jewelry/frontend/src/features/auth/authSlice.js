import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config';

// Async thunks
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/users/profile',
        userData,
        config
      );

      // Update localStorage with new user data
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile.'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      };

      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      };

      console.log('Sending registration request...', {
        url: API_ENDPOINTS.REGISTER,
        data: { name, email, password: '***', confirmPassword: '***' }
      });
      
      const response = await axios.post(
        API_ENDPOINTS.REGISTER,
        { name, email, password, confirmPassword },
        config
      );

      console.log('Registration successful:', response.data);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response) {
        // Handle 400 Bad Request with duplicate field error
        if (error.response.status === 400) {
          const errorData = error.response.data || {};
          if (errorData.error?.includes('Duplicate') || 
              errorData.message?.includes('Duplicate') ||
              error.response.data?.error?.includes('Duplicate') ||
              error.response.data?.message?.includes('already exists')) {
            errorMessage = 'This email is already registered. Please use a different email or login instead.';
          } else {
            // For other 400 errors, try to show the server's error message
            errorMessage = error.response.data?.error || 
                         error.response.data?.message || 
                         'Invalid registration data. Please check your information.';
          }
        } else {
          errorMessage = error.response.data?.message || 
                       error.response.data?.error || 
                       `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Logout cases
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    
    builder.addCase(logout.fulfilled, (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null;
      toast.success('Logged out successfully');
    });
    
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('Logout failed');
    });
    
    // Login cases
    builder.addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

// Create logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('userInfo');
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
