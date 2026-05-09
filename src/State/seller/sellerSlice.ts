
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

// Fetch seller profile
export const fetchSellerProfile = createAsyncThunk(
  "sellers/fetchSellerProfile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers/profile", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllSellers = createAsyncThunk(
  "sellers/fetchAllSellers",
  async ({ status, jwt }: { status: string; jwt: string }, { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers", {
        headers: { Authorization: `Bearer ${jwt}` },
        params: status !== "ALL" ? { status } : {},
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSellerStatus = createAsyncThunk(
  "sellers/updateSellerStatus",
  async (
    { id, status, jwt }: { id: number; status: string; jwt: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/sellers/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
           params: {
      status, 
    },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


interface SellerState {
  sellers: any[];
  selectedSeller: any;
  profile: any;
  report: any;
  loading: boolean;
  error: any;
}

const initialState: SellerState = {
  sellers: [],
  selectedSeller: null,
  profile: localStorage.getItem("sellerProfile")
            ? JSON.parse(localStorage.getItem("sellerProfile")!)
            : null,
  report: null,
  loading: false,
  error: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Profile fetch
    builder.addCase(fetchSellerProfile.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchSellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
        localStorage.setItem("sellerProfile", JSON.stringify(action.payload));
    })
    .addCase(fetchSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch all sellers
    builder.addCase(fetchAllSellers.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchAllSellers.fulfilled, (state, action) => {
      state.loading = false;
      state.sellers = action.payload;
    })
    .addCase(fetchAllSellers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update seller status
    builder.addCase(updateSellerStatus.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateSellerStatus.fulfilled, (state, action) => {
      state.loading = false;
      // Update the seller in sellers array
      state.sellers = state.sellers.map((seller) =>
        seller.id === action.payload.id ? action.payload : seller
      );
    })
    .addCase(updateSellerStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default sellerSlice.reducer;
