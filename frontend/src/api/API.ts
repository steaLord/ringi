import axios from "axios";

// Create an axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL || "http://localhost:3000/api", // Set your backend URL here
});

// Optionally, add interceptors for adding the token to requests automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return successful responses
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.history.pushState({}, "title", "/login");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
