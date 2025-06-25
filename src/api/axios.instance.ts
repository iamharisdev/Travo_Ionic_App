// axios.instance.ts

import axios from 'axios';
import { getStorageValue } from '../storage/storage.util';
import { STORAGE_TOKEN } from '../constant/storage.constant';

let storeInstance: any = null; // Will hold the store reference
type ApiName =
  | 'idApi'
  | 'providerApi'
  | 'practiceApi'
  | 'billingApi'
  | 'schedulingApi'
  | 'patientApi';

// Export this function so main.tsx can inject the store instance
export const setStoreInstance = (store: any) => {
  storeInstance = store;
};

// Helper function to set auth header and base URL
const setAuthHeadersAndBaseUrl = async (config: any, apiName: ApiName) => {
  if (!storeInstance) {
    throw new Error(
      'Store instance is not set. Please call setStoreInstance(store) before making API calls.'
    );
  }
  const state = storeInstance.getState();
  const env = state.white?.currentEnv || {};
  const token = await getStorageValue(STORAGE_TOKEN);

  const baseURLs = {
    idApi: env.idApiBaseUrl || 'https://qaid.trovahealth.app/',
    providerApi: env.providerApiBaseUrl || 'https://qaproviderapi.trovahealth.app/api/v1/',
    practiceApi: env.practiceApiBaseUrl || 'https://qapracticeapi.trovahealth.app/api/v1/',
    billingApi: env.billingApiBaseUrl || 'https://qabilling.trovahealth.app/api/v1/',
    schedulingApi: env.schedulingApiBaseUrl || 'https://qaschedulingapi.trovahealth.app/api/v1/',
    patientApi: env.patientApiBaseUrl || 'https://qapatientapi.trovahealth.app/api/v1/',
  };

  config.baseURL = baseURLs[apiName];

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
  }

  return config;
};

// Axios instances
export const idApiInstance = axios.create();
export const providerApiInstance = axios.create();
export const practiceApiInstance = axios.create();
export const billingApiInstance = axios.create();
export const schedulingApiInstance = axios.create();
export const patientApiInstance = axios.create();

// Interceptors
idApiInstance.interceptors.request.use(
  config => setAuthHeadersAndBaseUrl(config, 'idApi'),
  error => Promise.reject(error)
);

providerApiInstance.interceptors.request.use(
  config => setAuthHeadersAndBaseUrl(config, 'providerApi'),
  error => Promise.reject(error)
);

practiceApiInstance.interceptors.request.use(
  config => setAuthHeadersAndBaseUrl(config, 'practiceApi'),
  error => Promise.reject(error)
);
// ✅ Add this below it
practiceApiInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

billingApiInstance.interceptors.request.use(
  config => setAuthHeadersAndBaseUrl(config, 'billingApi'),
  error => Promise.reject(error)
);

schedulingApiInstance.interceptors.request.use(
  config => setAuthHeadersAndBaseUrl(config, 'schedulingApi'),
  error => Promise.reject(error)
);

patientApiInstance.interceptors.request.use(
  config => setAuthHeadersAndBaseUrl(config, 'patientApi'),
  error => Promise.reject(error)
);
