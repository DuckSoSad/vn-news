import axios from 'axios';

import { useAuthStore } from '~/store/useAuthStore';
import { ENDPOINTS } from './endpoints';

const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },

  // 🌟 QUAN TRỌNG: Cho phép axios tự động gửi và nhận Cookie từ Backend
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken; // get token from Zustand (useAuthStore)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // attach to header
  }
  return config;
});

// Check the returned result. If you receive a 401 error (Expired), get a new token!
api.interceptors.response.use(
  (response) => response.data, // if success, return the clean data
  async (error) => {
    const originalRequest = error.config; // take note the original failed request
    const isAuthEndpoint =
      originalRequest?.url?.includes(ENDPOINTS.login) ||
      originalRequest?.url?.includes(ENDPOINTS.register) ||
      originalRequest?.url?.includes(ENDPOINTS.refreshToken);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post(ENDPOINTS.refreshToken, {});

        const newAccessToken = res.data.accessToken; // receive new access token

        useAuthStore.setState({
          accessToken: newAccessToken,
          isAuthenticated: true,
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
