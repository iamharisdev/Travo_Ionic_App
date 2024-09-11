import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import providerReducer from './providerSlice';
import practiceReducer from './practiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    provider: providerReducer,
    practice: practiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;