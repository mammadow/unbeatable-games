export default {
  API_BASE: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  ENVIRONMENT: import.meta.env.MODE || "development",
};
