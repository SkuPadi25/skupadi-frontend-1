import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // set true later if you change to cookies
});

// Attach token before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh interceptor
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // skip if already retried
    if (!original || original._retry) throw err;

    if (err.response?.status === 401) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(original);
      } catch (e) {
        localStorage.clear();
        window.location.href = "/login";
        throw e;
      }
    }

    throw err;
  }
);
