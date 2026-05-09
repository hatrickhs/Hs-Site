// import { api } from '../../../config/Api'
// import { HomeCategory } from "../../../State/types/HomeCategoryTypes";

// /* ➕ ADD CATEGORY */
// export const createHomeCategories = (data: HomeCategory[]) =>
//   api.post("/home/categories", data);

// /* ✏️ UPDATE CATEGORY */
// export const updateHomeCategory = (
//   id: number,
//   data: HomeCategory
// ) => api.patch(`/admin/home-category/${id}`, data);

// /* 🗑 DELETE CATEGORY */
// export const deleteHomeCategory = (id: number) =>
//   api.delete(`/admin/home-category/${id}`);

// /* 📥 GET ALL */
// export const getHomeCategories = () =>
//   api.get("/admin/home-category");


import axios from "axios";
import { HomeCategory } from "../../../State/types/HomeCategoryTypes";

const API_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createHomeCategory = (category: HomeCategory) =>
  api.post(`/home/category`, category);


// Update category
export const updateHomeCategory = (id: number, category: HomeCategory) =>
  api.patch(`/admin/home-category/${id}`, category);

// Delete category
export const deleteHomeCategory = (id: number) =>
  api.delete(`/admin/home-category/${id}`);

// Get all categories
export const getHomeCategories = () =>
  api.get<HomeCategory[]>(`/admin/home-category`);
