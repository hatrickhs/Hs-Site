import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Coupon } from "../types/couponType";

// fetch all coupons
export const fetchCoupons = createAsyncThunk<Coupon[], string>(
  "adminCoupon/fetchCoupons",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/coupons", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch coupons");
    }
  }
);

// delete coupon
export const deleteCoupon = createAsyncThunk<
  number,
  { id: number; jwt: string },
  { rejectValue: string }
>(
  "adminCoupon/deleteCoupon",
  async ({ id, jwt }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete coupon");
    }
  }
);

interface AdminCouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AdminCouponState = {
  coupons: [],
  loading: false,
  error: null,
  success: null,
};

const adminCouponSlice = createSlice({
  name: "adminCoupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.coupons = state.coupons.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminCouponSlice.reducer;
