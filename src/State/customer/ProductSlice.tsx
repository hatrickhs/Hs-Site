
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../types/ProductType";

const API_URL = "/products";

// Single Product
export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Search Product
export const searchProduct = createAsyncThunk(
  "products/searchProduct",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/search`, { params: { query } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch All Products
export const fetchAllProducts = createAsyncThunk<any, any>(
  "products/fetchAllProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products`, { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk<
  any,
  {
    category: string;
    section: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    mindiscount?: number;
    keyword?: string,
    page?: number;
    sort?: string;
  }
>(
  "products/fetchProductsByCategory",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get("/products", {

        params: {
  ...(filters.category && { category: filters.category }),
  ...(filters.color && { color: filters.color }),
  ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
  ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
  ...(filters.mindiscount !== undefined && { mindiscount: filters.mindiscount }),
  ...(filters.keyword && { keyword: filters.keyword }),
  ...(filters.page !== undefined && { page: filters.page }),
  ...(filters.sort && { sort: filters.sort }),
}
      });

      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


interface ProductState {
  product: Product | null;
  products: Product[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchProduct: Product[];
}

const initialState: ProductState = {
  product: null,
  products: [],
  totalPages: 1,
  loading: false,
  error: null,
  searchProduct: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Single Product
    builder.addCase(fetchProductById.pending, (state) => { state.loading = true; });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // All Products
    builder.addCase(fetchAllProducts.pending, (state) => { state.loading = true; });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload?.content || [];
      state.totalPages = action.payload?.totalPages || 1;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Search Product
    builder.addCase(searchProduct.pending, (state) => { state.loading = true; });
    builder.addCase(searchProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.searchProduct = action.payload;
    });
    builder.addCase(searchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //  Products by Category
    builder.addCase(fetchProductsByCategory.pending, (state) => { state.loading = true; });
    
    builder.addCase(fetchProductsByCategory.fulfilled, (state, action) => {
  state.loading = false;
  state.products = action.payload.content || [];
  state.totalPages = action.payload.totalPages || 1;
});

    builder.addCase(fetchProductsByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default productSlice.reducer;
