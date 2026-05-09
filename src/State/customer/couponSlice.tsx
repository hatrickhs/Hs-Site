import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "../types/cartTypes";
import { api, API_URL } from "../../config/Api";
import { CouponState } from "../types/couponType";


export const applyCoupon = createAsyncThunk<
Cart,
{
    apply: string;
    code: string;
    orderValue: number;
    jwt: string;
},
{ rejectValue: string }
>(
    "coupon/applyCoupon",
      async ({ apply, code, orderValue, jwt }, { rejectWithValue }) => {
        try {
          const response = await api.post(`${API_URL}/apply`, null, { 
            params: {apply, code, orderValue},
            headers: { Authorization: `Bearer ${jwt}`},
           });
          console.log("apply coupon", response.data);
          return response.data;
        } catch (error: any) {
          console.log("error ---", error);
          return rejectWithValue(error.response?.data?.message || "Failed to apply coupon");
        }
      }
    );

const initialState: CouponState = {
    coupons: [],
    cart: null,
    loading: false,
    success: null,
    error: null,
    couponCreated: false,
    couponApplied: false,
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
   reducers: {},
   extraReducers: (builder) => {
    builder
    .addCase(applyCoupon.pending, (state)=> {
        state.loading = true;
        state.error = null;
        state.couponApplied = false;
    })
    .addCase(applyCoupon.fulfilled, (state, action)=> {
        state.loading = false;
        state.cart = action.payload;
        state.success = "Coupon applied successfully";
        if(action.meta.arg.apply=="true"){
            state.couponApplied=true
        }
    })

    .addCase(
        applyCoupon.rejected,
        (state, action: PayloadAction<string | undefined>) => {
            state.loading = false;
           state.error = action.payload || "Failed to apply coupon";
            state.couponApplied=false;
        }
    );
   }
    

});

export default couponSlice.reducer;