import axios from "axios";

// export const API_URL = "http://localhost:5000";
export const API_URL =
  (window as any)._env_?.REACT_APP_API_URL || "";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  let token = localStorage.getItem("jwt");


  if (!token || token === "null" || token === "undefined" || token.trim() === "") {
    token = null;
  }

  if (config.url) {
    const url = new URL(config.url, API_URL).pathname;

    if (!url.startsWith("/auth") && token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("URL:", config.url, "Token:", config.headers.Authorization);
    }
  }

  return config;
});
