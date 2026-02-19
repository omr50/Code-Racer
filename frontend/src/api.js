import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const initApiInterceptors = ({ logout, navigate }) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const url = error?.config?.url;

      console.log("[api interceptor] status:", status, "url:", url);

      if ((status === 401 || status === 403) && !String(url).includes("/auth/")) {
        logout();
        // send them home
        navigate("/", { replace: true });
      }

      return Promise.reject(error);
    }
  );
};

export default api;
