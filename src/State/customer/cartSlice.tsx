
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Cart, CartItem } from "../types/cartTypes";
import { sumCartItemMrpPrice, sumCartItemSellingPrice } from "../../Util/sumCartItemMrpPrice";
import { User } from "../types/userTypes";

interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
}

const emptyCart: Cart = {
  id: 0,
  user: {} as User,
  cartItems: [],
  couponCode: null,
  code: null,
  totalMrpPrice: 0,
  totalSellingPrice: 0,
  discount: 0,
  couponDiscount: 0,
  totalItem: 0
};

const initialState: CartState = {
  cart: emptyCart,
  loading: false,
  error: null,
};

const API_URL = "/api/cart";

export const fetchUserCart = createAsyncThunk<Cart, { jwt: string; role: string }>(
  "cart/fetchUserCart",
  async ({ jwt, role }, { rejectWithValue }) => {
    try {
      if (role === "ROLE_SELLER") {
        return {
          id: 0,
          user: {} as User,
          cartItems: [],
          couponCode: null,
          code: null,
          totalMrpPrice: 0,
          totalSellingPrice: 0,
          discount: 0,
          couponDiscount: 0,
          totalItem: 0,
        } as Cart;
      }

      const response = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return typeof response.data === "string" ? JSON.parse(response.data) : response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch user cart");
    }
  }
);


// Add Item
interface AddItemRequest { productId?: number; dealId?: number; size: string; quantity: number }

export const addItemToCart = createAsyncThunk<CartItem, { jwt: string; request: AddItemRequest }>(
  "cart/addItemToCart",
  async ({ jwt, request }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/add`, request, { headers: { Authorization: `Bearer ${jwt}` } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to add item to cart");
    }
  }
);

// Update Item
export const updateCartItem = createAsyncThunk<CartItem, { jwt: string; cartItemId: number; cartItem: any }>(
  "cart/updateCartItem",
  async ({ jwt, cartItemId, cartItem }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/item/${cartItemId}`, cartItem, { headers: { Authorization: `Bearer ${jwt}` } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to update cart item");
    }
  }
);

// Delete Item
export const deleteCartItem = createAsyncThunk<number, { jwt: string; cartItemId: number }>(
  "cart/deleteCartItem",
  async ({ jwt, cartItemId }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/item/${cartItemId}`, { headers: { Authorization: `Bearer ${jwt}` } });
      return cartItemId;
    } catch (error: any) {
      return rejectWithValue("Failed to delete cart item");
    }
  }
);

export const applyCoupon = createAsyncThunk<Cart, { jwt: string; couponCode: string }>(
  "cart/applyCoupon",
  async ({ jwt, couponCode }, { rejectWithValue }) => {
    try {

      const response = await api.post(
        `${API_URL}/apply-coupon`,
        { couponCode },
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );

      console.log("COUPON APPLY SUCCESS");
      console.log(response.data);

      return response.data;

    } catch (error: any) {

      console.log("COUPON APPLY ERROR");
      console.log(error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Failed to apply coupon"
      );
    }
  }
);

export const removeCoupon = createAsyncThunk<Cart, { jwt: string; couponCode: string }>(
  "cart/removeCoupon",
  async ({ jwt, couponCode }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_URL}/remove-coupon`,
        { couponCode },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove coupon");
    }
  }
);


// Slice 
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = emptyCart;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<Cart>) => { state.cart = action.payload; state.loading = false; })
      .addCase(fetchUserCart.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // Add
      .addCase(addItemToCart.pending, (state) => { state.loading = true; state.error = null; })

      .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        if (!state.cart) state.cart = emptyCart;
        if (!state.cart.cartItems) state.cart.cartItems = [];
        state.cart.cartItems.push(action.payload);
        state.cart.totalSellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
        state.cart.totalMrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
        state.loading = false;
      })

      .addCase(addItemToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // Update
      .addCase(updateCartItem.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
        if (state.cart) {
          const index = state.cart.cartItems.findIndex(i => i.id === action.payload.id);
          if (index !== -1) state.cart.cartItems[index] = action.payload;
          state.cart.totalSellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
          state.cart.totalMrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
        }
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // Delete
      .addCase(deleteCartItem.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteCartItem.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.cart) {
          state.cart.cartItems = state.cart.cartItems.filter(i => i.id !== action.payload);
          state.cart.totalSellingPrice = sumCartItemSellingPrice(state.cart.cartItems);
          state.cart.totalMrpPrice = sumCartItemMrpPrice(state.cart.cartItems);
        }
        state.loading = false;
      })
      .addCase(deleteCartItem.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // Coupon Apply
      .addCase(applyCoupon.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyCoupon.fulfilled, (state, action: PayloadAction<Cart>) => { state.cart = action.payload; state.loading = false; })
      .addCase(applyCoupon.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // Coupon Remove
      .addCase(removeCoupon.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeCoupon.fulfilled, (state, action: PayloadAction<Cart>) => { state.cart = action.payload; state.loading = false; })
      .addCase(removeCoupon.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
