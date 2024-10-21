import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import providerReducer from './providerSlice';
import practiceReducer from './practiceSlice';
import billingReducer from './billingSlice';
import schedulingReducer from './schedulingSlice';
import calendarReducer from './calendarSlice';
import patientReducer from './patientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    provider: providerReducer,
    practice: practiceReducer,
    billing: billingReducer,
    scheduling: schedulingReducer,
    calendar: calendarReducer,
    patient: patientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;