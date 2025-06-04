// utils/getApiInstance.ts
import axios from 'axios';
import { store } from '../../state/store';
import { getStorageValue } from '../../storage/storage.util';
import { STORAGE_TOKEN } from '../../constant/storage.constant';




export const getApiInstance = async (type: 'id' | 'provider' | 'practice' | 'billing' | 'scheduling' | 'patient') => {
  const state = store.getState();
  const env = state.auth.currentEnv; // assuming your redux slice is like { env: { ID_API_URL: '...', ... } }
  console.log("ENV:=>  ",env)

  const baseURLs: Record<string, string> = {
    id: env.ID_API_URL,
    provider: env.PROVIDER_API_URL,
    practice: env.PRACTICE_API_URL,
    billing: env.BILLING_API_URL,
    scheduling: env.SCHEDULING_API_URL,
    patient: env.PATIENT_API_URL,
  };

  const token = await getStorageValue(STORAGE_TOKEN);

  const instance = axios.create({
    baseURL: baseURLs[type],
  });

  instance.interceptors.request.use(
    config => {
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        };
      }
      return config;
    },
    error => Promise.reject(error)
  );

  return instance;
};
