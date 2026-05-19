
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HomeData, HomeCategory } from "../types/HomeCategoryTypes";
import { api } from "../../config/Api";

/* FETCH HOME PAGE DATA*/

export const fetchHomepageData = createAsyncThunk<HomeData>(
  "home/fetchHomePageData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/deals");
       const catRes = await api.get("/admin/home-category");
      console.log("API RESPONSE:", response);
      console.log("CATEGORY RESPONSE:", catRes);
      return{ 
      id: 0,
        grid: [],
        electricCategories: [],
        shopByCategories: [],
        deals: response.data,
        dealCategories: catRes.data,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load";
      return rejectWithValue(errorMessage);
    }
  }
);

/*FETCH HOME CATEGORIES*/

export const createHomeCategory = createAsyncThunk<HomeCategory[]>(
  "home/createHomeCategory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/home-category");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

/* STATE TYPE */

interface CustomerState {
  homePageData: HomeData | null;
  categories: HomeCategory[];
  loading: boolean;
  error: string | null;
}

/* INITIAL STATE */
const initialState: CustomerState = {
  homePageData: null,
  categories: [],
  loading: false,
  error: null,
};

/* SLICE */
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // homepage data
      .addCase(fetchHomepageData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomepageData.fulfilled, (state, action) => {
        state.loading = false;
        state.homePageData = action.payload;
      })
      .addCase(fetchHomepageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // categories
      .addCase(createHomeCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(createHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;