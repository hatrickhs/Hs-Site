import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order } from "../types/orderType";
import { Seller } from "../types/SellerTypes";
import { User } from "../types/userTypes";
import { api } from "../../config/Api";
import reducer from "./sellerSlice";


export interface Transaction {
    id: number;
    customer: User;
    order: Order;
    seller: Seller;
    date: string;
}

interface TransactionState {
    transactions: Transaction[];
    transaction: Transaction | null;
    loading:boolean;
    error: string | null;
}

const initialState: TransactionState = {
    transactions: [],
    transaction: null,
    loading: false,
    error: null,
};

export const fetchTransactionBySeller = createAsyncThunk<
Transaction[],
string,
{ rejectValue: string }
>('transactions/fetchTransactionBySeller', async (jwt, { rejectWithValue }) => {
 
    try {
      const response = await api.get(`/api/transactions/seller`, {
        headers: {
             Authorization: `Bearer ${jwt}` },
      });
      console.log("fetchTransactionBySeller", response.data)
      return response.data;
    } catch (error: any) {
        if (error.response) {
            return rejectWithValue(error.response.data.message);
        }
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);

export const fetchallTransaction = createAsyncThunk<
Transaction[],
void,
{ rejectValue: string }>(
  "transactions/fetchAllTransactions",async (_,  { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/transactions`,); 
      return response.data;
     } catch (error: any) {
        if (error.response) {
            return rejectWithValue(error.response.data.message);
        }
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTransactionBySeller.pending, (state) => {
            state.loading = true;
            state.error= null;
        })
          .addCase(fetchTransactionBySeller.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = action.payload;
        })
          .addCase(fetchTransactionBySeller.rejected, (state, action) => {
            state.loading = false;
            state.error= action.payload as string;
        })
          .addCase(fetchallTransaction.pending, (state) => {
            state.loading = true;
            state.error= null;
        })
          .addCase(fetchallTransaction.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = action.payload;
        })
          .addCase(fetchallTransaction.rejected, (state, action) => {
            state.loading = false;
            state.error= action.payload as string;
        })
    }
})


export default transactionSlice.reducer;
