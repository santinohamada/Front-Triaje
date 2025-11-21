// src/lib/api.ts
import axios, { AxiosError } from "axios";
import { config } from "./config";

const endPoint = config.apiUrl as string;
console.log(endPoint)
const api = axios.create({
  baseURL: endPoint,

});

// 🔹 Request interceptor → headers comunes + JWT
api.interceptors.request.use((config) => {
  
  // JWT
  const token = localStorage.getItem("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});



export default api;