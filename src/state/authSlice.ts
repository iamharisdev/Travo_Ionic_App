import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signIn } from '../api/services/auth';
import { setStorageValue } from '../storage/storage.util';
import { STORAGE_TOKEN } from '../constant/storage.constant';
import { resetAll } from './common.actions';

export interface AuthState {
  success: boolean;
  token: string;
  message: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  success: false,
  token: '',
  message: ''
};

export const signInAction = createAsyncThunk(
  'auth/sign-in',
  async ({ email, password }: SignInCredentials): Promise<AuthState> => {
    try {
      const response = await signIn(email, password);

      const payload = {
        success: response.data.success,
        token: response.data.token,
        message: response.data.message,
      };

      await Promise.all([
        setStorageValue(STORAGE_TOKEN, response.data.token),
      ]);

      return payload;
    } catch (error: any) {
      console.error('[sign-in]: ', error);
      const payload = {
        success: false,
        token: '',
        message: error.response.statusText,
      };

      return payload;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, () => console.log('pending sign-in user'))
      .addCase(signInAction.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.success = action.payload.success;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(resetAll, () => initialState)
      .addCase(signInAction.rejected, (state) => {
        state.success = false;
        state.token = '';
        state.message = 'Request rejected';
      });
  }
});

export default authSlice.reducer;