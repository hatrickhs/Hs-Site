
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../types/ProductType";

/* FETCH SELLER PRODUCTS */

export const fetchSellerProducts = createAsyncThunk<Product[], any>(
  "sellerProduct/fetchSellerProducts",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers/products", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* CREATE PRODUCT */

export const createProduct = createAsyncThunk<
  Product,
  { request: any; jwt: string | null }
>("sellerProduct/createProduct", async (args, { rejectWithValue }) => {
  const { request, jwt } = args;
  try {
    const response = await api.post("/sellers/products", request, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

/* UPDATE PRODUCT */

export const updateSellerProduct = createAsyncThunk<
  Product,
  { productId: number; request: any; jwt: string | null }
>("sellerProduct/updateProduct", async (args, { rejectWithValue }) => {
  const { productId, request, jwt } = args;
  try {
    const response = await api.put(
      `/sellers/products/${productId}`,
      request,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

/* UPDATE STOCK */

export const updateProductStock = createAsyncThunk<
  Product,
  { productId: number; inStock: boolean; jwt: string | null }
>("sellerProduct/updateStock", async (args, { rejectWithValue }) => {
  const { productId, inStock, jwt } = args;
  try {
    const response = await api.put(
      `/products/${productId}/stock?inStock=${inStock}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

/* DELETE PRODUCT */

export const deleteSellerProduct = createAsyncThunk<
  number,
  { productId: number; jwt: string | null }
>("sellerProduct/deleteProduct", async (args, { rejectWithValue }) => {
  const { productId, jwt } = args;
  try {
    await api.delete(`/sellers/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return productId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

/* SLICE */

interface SellerProductState {
  products: Product[];
  loading: boolean;
  error: string | null | undefined;
  success: string | null;
}

const initialState: SellerProductState = {
  products: [],
  loading: false,
  error: null,
  success: null
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    
    /* FETCH */
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    /* CREATE */
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.success = "Product added successfully";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.error = action.payload as string;
      });

    /* UPDATE */
    builder
      .addCase(updateSellerProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    /* STOCK UPDATE */
    builder
      .addCase(updateProductStock.pending, (state) => {
        state.loading = true;
      })
      
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProduct = action.payload;

        state.products = state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        );
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    /* DELETE */
    builder
      .addCase(deleteSellerProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { clearMessage } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;

