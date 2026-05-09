
import { Wishlist, WishlistState } from "../types/WishlistTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";


const initialState: WishlistState = {
    wishlist: null,
    loading: false,
    error: null,
}

export const getWishlistByUserId = createAsyncThunk(
    "wishlist/getWishlistByUserId",
    async (__, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/wishlist", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            console.log("wishlist fetch", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error", error);
            return rejectWithValue(
                error.response?.data || error.message || "Failed to fetch wishlist"
            );
        }
    }
);

export const addDealToWishlist = createAsyncThunk(
    "wishlist/addDealToWishlist",
    async ({ dealId }: { dealId: number }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/api/wishlist/add-deal/${dealId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                }
            );

            console.log("add deal", response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add deal to wishlist"
            );
        }
    }
);

export const removeDealFromWishlist = createAsyncThunk(
    "wishlist/removeDealFromWishlist",
    async ({ dealId }: { dealId: number }, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `/api/wishlist/remove-deal/${dealId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove deal"
            );
        }
    }
);

export const removeProductFromWishlist = createAsyncThunk(
    "wishlist/removeProductFromWishlist",
    async ({ productId }: { productId: number }, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `/api/wishlist/remove-product/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove product"
            );
        }
    }
);

export const addProductToWishlist = createAsyncThunk(
    "wishlist/addProductToWishlist",
    async ({ productId }: { productId: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post(`/api/wishlist/add-product/${productId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
            console.log("add product ", response.data);
            return response.data;
        } catch (error: any) {

            return rejectWithValue(
                error.response?.data.message || "Failed to add product to wishlist"
            );
        }
    }
);

const WishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        resetWishlistState: (state) => {
            state.wishlist = null;
            state.loading = false;
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder.addCase(getWishlistByUserId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(
            getWishlistByUserId.fulfilled,
            (state, action: PayloadAction<Wishlist>) => {
                state.wishlist = action.payload;
                state.loading = false;

            }
        );
        builder.addCase(
            getWishlistByUserId.rejected,
            (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;

            }
        );

        builder.addCase(
            addProductToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;

            }
        );

        builder.addCase(
            addProductToWishlist.fulfilled,
            (state, action: PayloadAction<Wishlist>) => {
                state.wishlist = action.payload;
                state.loading = false;

            }
        );

        builder.addCase(
            addProductToWishlist.rejected,
            (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;

            }
        );
        builder.addCase(addDealToWishlist.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(
            addDealToWishlist.fulfilled,
            (state, action: PayloadAction<Wishlist>) => {
                state.wishlist = action.payload;
                state.loading = false;
            }
        );

        builder.addCase(addDealToWishlist.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === "string"
                    ? action.payload
                    : "Failed to add deal";
        });

        builder.addCase(removeProductFromWishlist.fulfilled, (state, action) => {
            state.wishlist = action.payload;
            state.loading = false;
        });

        builder.addCase(removeDealFromWishlist.fulfilled, (state, action) => {
            state.wishlist = action.payload;
            state.loading = false;
        });

    }
});

export const { resetWishlistState } = WishlistSlice.actions;

export default WishlistSlice.reducer;