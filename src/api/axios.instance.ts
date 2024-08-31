import axios from 'axios';
import { getStorageValue } from '../storage/storage.util';
import { STORAGE_TOKEN } from '../constant/storage.constant';

export const privateAxiosInstance = axios.create({
  baseURL: '/api',
});

export const publicAxiosInstance = axios.create({
  baseURL: '/api',
});

privateAxiosInstance.interceptors.request.use(
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