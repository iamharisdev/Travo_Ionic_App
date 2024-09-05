import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAll } from './common.actions';

interface LoadingState {
  loading: boolean;
  message?: string;
  error?: any;
}

const initialState: LoadingState = {
  loading: false,
  error: null,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<LoadingState>) => {
      const { loading, message, error } = action.payload;
      state.loading = loading;
      state.message = message;
      state.error = error;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState);
  }
});

export const { setLoading } = loadingSlice.actions

export default loadingSlice.reducer;