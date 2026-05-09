
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateDealRequest, Deal, DealsState } from "../types/DealTypes";
import { api, API_URL } from "../../config/Api";

type FetchDealsParams = {
  categoryId: number;
  section: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  mindiscount?: number;
  keyword?: string;
  page?: number;
  sort?: string;
};

const initialState: DealsState = {
  deals: [],
  filteredDeals: [],
  selectedDeal: null,
  loading: false,
  error: null,
  dealCreated: false,
  dealUpdated: false,
};

// GET all deals
export const getAllDeals = createAsyncThunk(
  "deals/getAllDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/deals", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      // Convert backend Deal to frontend Deal type if needed
      const deals: Deal[] = response.data.map((d: any) => ({
        id: d.id,
        name: d.name || "Deal",
        images: Array.isArray(d.images)
          ? d.images
          : d.images
           ? d.images
            : [],
        discount: d.discount,
        mrpPrice: d.mrpPrice,
        sellingPrice: d.sellingPrice,
        categoryId: d.categoryId ?? 0,
      }));
      return deals;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch deals");
    }
  }
);

export const fetchDealsByCategory = createAsyncThunk<
  any,
  FetchDealsParams
>(
  "deal/fetchDealsByCategory",
  async (params, { rejectWithValue }) => {
    try {
      const { categoryId, ...filters } = params;

      const { data } = await api.get(
        `/admin/deals/category/${categoryId}`,
        {
          params: {
            ...(filters.color && { color: filters.color }),
            ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
            ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),
            ...(filters.mindiscount !== undefined && { mindiscount: filters.mindiscount }),
            ...(filters.keyword && { keyword: filters.keyword }),
            ...(filters.page !== undefined && { page: filters.page }),
            ...(filters.sort && { sort: filters.sort }),
          },
        }
      );

      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue("Failed to fetch deals");
    }
  }
);

export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (reqData: CreateDealRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/deals", reqData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      // backend response → frontend Deal convert
      const d = response.data;

      const newDeal: Deal = {
        id: d.id,
        name: d.name || "Deal",
        images: d.images || ["/default-deal.png"],
        discount: d.discount,
        mrpPrice: d.mrpPrice,
        sellingPrice: d.sellingPrice,
        categoryId: d.category?.id ?? 0,

        levelThreeCategory: "",
        levelTwoCategory: "",
        mainCategory: "",
        category: d.category ?? null
      };

      return newDeal;

    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create deal"
      );
    }
  }
);

export const deleteDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (id: number, { rejectWithValue }) => {
    try {

      await api.delete(`/admin/deals/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      return id;

    } catch (err: any) {

      return rejectWithValue(
        err.response?.data?.message || "Failed to delete deal"
      );
    }
  }
);

export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async (deal: Deal, { rejectWithValue }) => {
    try {

      const response = await api.patch(
        `/admin/deals/${deal.id}`,
        deal,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      return response.data;

    } catch (err: any) {

      return rejectWithValue(
        err.response?.data?.message || "Failed to update deal"
      );

    }
  }
);

export const fetchDealById = createAsyncThunk<Deal, string>(
  "deals/fetchDealById",
  async (dealId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/deals/${dealId}`);

      const d = response.data;

      const deal: Deal = {
        id: d.id,
        name: d.name || "Deal",
        images: d.images || ["/default-deal.png"],
        discount: d.discount || 0,
        mrpPrice: d.mrpPrice || 0,
        sellingPrice: d.sellingPrice || 0,
        categoryId: d.category?.id ?? 0,
        category: d.category ?? null,
        levelThreeCategory: "",
        levelTwoCategory: "",
        mainCategory: "",
      };

      return deal;

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dealSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
      state.loading = false;
      state.deals = action.payload;
    });
    builder.addCase(getAllDeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createDeal.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.dealCreated = false;
    });
    builder.addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
      state.loading = false;
      state.dealCreated = true;
      state.deals.push(action.payload);
    });
    builder.addCase(createDeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchDealsByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.filteredDeals = action.payload ?? [];
    });
    builder.addCase(fetchDealsByCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchDealsByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "error";
    });
    builder.addCase(fetchDealById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedDeal = action.payload;
    });

    builder.addCase(fetchDealById.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchDealById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(deleteDeal.fulfilled, (state, action) => {

      state.deals = state.deals.filter(
        (deal) => deal.id !== action.payload
      );

      state.filteredDeals = state.filteredDeals.filter(
        (deal) => deal.id !== action.payload
      );

    });
    builder.addCase(updateDeal.fulfilled, (state, action) => {

      state.deals = state.deals.map((deal) =>
        deal.id === action.payload.id
          ? {
            ...deal,
            ...action.payload,
            categoryId: action.payload.category?.id ?? deal.categoryId,
          }
          : deal
      );

      state.dealUpdated = true;

    });
  },
});

export default dealSlice.reducer;
