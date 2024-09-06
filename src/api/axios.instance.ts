import axios from 'axios';
import { getStorageValue } from '../storage/storage.util';
import { STORAGE_TOKEN } from '../constant/storage.constant';

export const idApiInstance = axios.create({
  baseURL: process.env.REACT_APP_ID_API_URL,
});

export const providerApiInstance = axios.create({
  baseURL: process.env.REACT_APP_PROVIDER_API_URL,
});

providerApiInstance.interceptors.request.use(
  async config => {
    const token = await getStorageValue(STORAGE_TOKEN);
    if (token) {
      config = {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        } as any,
      };
    }

    return config;
  },
  error => {
    Promise.reject(error)
  });