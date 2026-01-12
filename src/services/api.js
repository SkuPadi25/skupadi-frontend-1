// src/services/api.js
import axios from "axios";
import {
  getLS,
  saveAuthTokens,
  removeLS,
  LS_KEYS,
} from "../utils/storage";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API_URL) ||
  "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/* ================================
   REQUEST INTERCEPTOR
   Attach access token
================================ */
api.interceptors.request.use((config) => {
  const accessToken = getLS(LS_KEYS.ACCESS_TOKEN);

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* ================================
   REFRESH TOKEN STATE
================================ */
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  refreshQueue = [];
};

/* ================================
   RESPONSE INTERCEPTOR
   Refresh logic
================================ */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response || err.response.status !== 401) {
      return Promise.reject(err);
    }

    // prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(err);
    }
    originalRequest._retry = true;

    try {
      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      const refreshToken = getLS(LS_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        processQueue(new Error("No refresh token"));
        return Promise.reject(err);
      }

      // IMPORTANT: use raw axios to avoid interceptor recursion
      const response = await axios.post(`${API_BASE}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      saveAuthTokens({
        accessToken,
        refreshToken: newRefreshToken,
      });

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      // clear auth via helpers
      removeLS(LS_KEYS.ACCESS_TOKEN);
      removeLS(LS_KEYS.REFRESH_TOKEN);
      removeLS(LS_KEYS.USER);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
