import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import providerReducer from './providerSlice';
import practiceReducer from './practiceSlice';
import billingReducer from './billingSlice';
import schedulingReducer from './schedulingSlice';
import calendarReducer from './calendarSlice';
import patientReducer from './patientSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['provider'], // only provider will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  provider: providerReducer,
  practice: practiceReducer,
  billing: billingReducer,
  scheduling: schedulingReducer,
  calendar: calendarReducer,
  patient: patientReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;