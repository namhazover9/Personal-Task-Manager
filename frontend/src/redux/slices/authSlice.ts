import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../../api/authApi';
import { AuthRequest, AuthResponse, UserRegistration } from '../../types/auth';


// Định nghĩa kiểu cho state
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Giá trị khởi tạo cho state
const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk cho login
export const login = createAsyncThunk<AuthResponse, AuthRequest>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// Async thunk cho register
export const register = createAsyncThunk<void, UserRegistration>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      await registerApi(data);
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);

        try {
          // Decode JWT to get username
          const base64Url = action.payload.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const payload = JSON.parse(jsonPayload);
          const username = payload.sub; // Subject usually holds username

          if (username) {
            localStorage.setItem('user', JSON.stringify({ username }));
          }
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Đăng nhập thất bại';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Đăng ký thất bại';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;