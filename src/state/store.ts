import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
// For web only (uses localStorage)
import storage from 'redux-persist/lib/storage';
// For native: use the line below instead of the one above
// import createCapacitorStorage from 'redux-persist-capacitor-storage';

import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import providerReducer from './providerSlice';
import practiceReducer from './practiceSlice';
import billingReducer from './billingSlice';
import schedulingReducer from './schedulingSlice';
import calendarReducer from './calendarSlice';
import patientReducer from './patientSlice';
import  whiteReducer from './persistSlice';

// Native storage (optional)
// const storage = createCapacitorStorage();

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  provider: providerReducer,
  practice: practiceReducer,
  billing: billingReducer,
  scheduling: schedulingReducer,
  calendar: calendarReducer,
  patient: patientReducer,
  white:whiteReducer,
});

// Only persist selected reducers (e.g., auth, provider)
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['white'], // Choose what to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
