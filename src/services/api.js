// src/services/api.js
import axios from "axios";
import {
  getLS,
  saveAuthTokens,
  removeLS,
  LS_KEYS,
} from "../utils/storage";
import { FRONTEND_ONLY_MODE } from "../utils/demoMode";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_API_URL) ||
  "http://localhost:4000";

const buildMockData = (method, url) => {
  const normalizedUrl = String(url || "").split("?")[0];

  if (normalizedUrl === "/dashboard") {
    return {
      kpis: [],
      monthlyRevenue: [],
      invoiceStatus: [],
      payByClass: [],
      priorityInvoices: [],
      recentActivity: [],
    };
  }

  if (normalizedUrl === "/payment-structures") {
    return { paymentStructures: [] };
  }

  if (normalizedUrl === "/school-classes") {
    return {
      classes: [
        { id: "primary_1", name: "Primary 1", level: "primary" },
        { id: "primary_2", name: "Primary 2", level: "primary" },
        { id: "jss_1", name: "JSS 1", level: "secondary" },
      ],
    };
  }

  if (normalizedUrl === "/students") {
    return {
      students: [
        {
          id: "student-001",
          firstName: "Ada",
          lastName: "Okafor",
          studentNumber: "STU001",
          classId: "primary_1",
          class: { id: "primary_1", name: "Primary 1", level: "primary" },
        },
        {
          id: "student-002",
          firstName: "Tobi",
          lastName: "Adeniyi",
          studentNumber: "STU002",
          classId: "jss_1",
          class: { id: "jss_1", name: "JSS 1", level: "secondary" },
        },
      ],
    };
  }

  if (normalizedUrl === "/invoices") {
    return method === "post"
      ? { success: true, invoices: [] }
      : {
          invoices: [],
          summary: {
            totalInvoices: 0,
            paidInvoices: 0,
            pendingInvoices: 0,
            overdueInvoices: 0,
          },
        };
  }

  return {};
};

const createMockApi = () => {
  const resolve = (method, url) => Promise.resolve({ data: buildMockData(method, url) });

  return {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: () => 0 },
      response: { use: () => 0 },
    },
    get: (url) => resolve("get", url),
    post: (url) => resolve("post", url),
    patch: (url) => resolve("patch", url),
    put: (url) => resolve("put", url),
    delete: (url) => resolve("delete", url),
  };
};

const api = FRONTEND_ONLY_MODE
  ? createMockApi()
  : axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
    });

const isPublicAuthEndpoint = (url = "") => {
  const normalizedUrl = String(url);

  return [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
  ].some((path) => normalizedUrl.includes(path));
};

/* ================================
   REQUEST INTERCEPTOR
   Attach access token
================================ */
if (!FRONTEND_ONLY_MODE) {
  api.interceptors.request.use((config) => {
    if (isPublicAuthEndpoint(config?.url)) {
      return config;
    }

    const accessToken = getLS(LS_KEYS.ACCESS_TOKEN);

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });
}

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
if (!FRONTEND_ONLY_MODE) {
  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (!err.response || err.response.status !== 401) {
        return Promise.reject(err);
      }

      if (isPublicAuthEndpoint(originalRequest?.url)) {
        return Promise.reject(err);
      }

      if (originalRequest._retry) {
        return Promise.reject(err);
      }
      originalRequest._retry = true;

      try {
        if (isRefreshing) {
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

        removeLS(LS_KEYS.ACCESS_TOKEN);
        removeLS(LS_KEYS.REFRESH_TOKEN);
        removeLS(LS_KEYS.USER);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

export default api;
