import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { signIn } from '../api/services/auth';
import { setStorageValue } from '../storage/storage.util';
import { STORAGE_TOKEN } from '../constant/storage.constant';
import { resetAll } from './common.actions';
import { StatusState } from '../shared/types/state.type';

export interface AuthProvider {
  sub: string;
  firstName: string;
  lastName: string;
  accountId: string;
  superAdmin: boolean;
  exp: number;
}

export interface AuthState {
  success: boolean;
  token: string;
  message: string;
  provider: AuthProvider | null;
  state: StatusState;
}

interface SignInCredentials {
  email: string;
  password: string;
}

const providerInitialState: AuthProvider = {
  sub: '',
  firstName: '',
  lastName: '',
  accountId: '',
  superAdmin: false,
  exp: 0,
};

const initialState: AuthState = {
  success: false,
  token: '',
  message: '',
  provider: providerInitialState,
  state: {
    success: false,
  },
};

export const signInAction = createAsyncThunk(
  'auth/sign-in',
  async ({ email, password }: SignInCredentials): Promise<AuthState> => {
    try {
      const response = await signIn(email, password);

  

      const provider = jwtDecode(response.data.token) as AuthProvider;

      const payload: AuthState = {
        success: response.data.success,
        token: response.data.token,
        message: response.data.message,
        provider,
        state: { success: true },
      };

      await Promise.all([setStorageValue(STORAGE_TOKEN, response.data.token)]);

      return payload;
    } catch (error: any) {
      console.error('[sign-in]: ', error);
      const payload = {
        success: false,
        token: '',
        message: error.response.statusText,
        provider: null,
        state: { success: false },
      };

      return payload;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reloadAuth: (state, action: PayloadAction<{ token: string }>) => {
      const provider = jwtDecode(action.payload.token) as AuthProvider;

      state.success = true;
      state.token = action.payload.token;
      state.message = 'auth reloaded';
      state.provider = provider;
      state.state = { success: true };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInAction.pending, () => console.log('pending sign-in user'))
      .addCase(signInAction.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.success = action.payload.success;
        state.token = action.payload.token;
        state.message = action.payload.message;
        state.provider = action.payload.provider;
        state.state = { success: true };
      })
      .addCase(resetAll, () => initialState)
      .addCase(signInAction.rejected, state => {
        state.success = false;
        state.token = '';
        state.message = 'Request rejected';
        state.provider = null;
        state.state = { success: false };
      });
  },
});

export const { reloadAuth } = authSlice.actions;

export default authSlice.reducer;
