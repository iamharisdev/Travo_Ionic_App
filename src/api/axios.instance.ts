import axios from 'axios';
import { getStorageValue } from '../storage/storage.util';
import { STORAGE_TOKEN } from '../constant/storage.constant';

// TODO: configure provider api url

export const privateAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const publicAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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