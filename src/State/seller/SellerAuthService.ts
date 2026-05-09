import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { fetchSellerProfile } from "./sellerSlice";


export const sendLoginSignupOtp = createAsyncThunk(
  "auth/sendLoginSignupOtp",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/sent/login-signup-otp", { email });
      console.log("login otp", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error ---", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const signing = createAsyncThunk<any, any>(
  "auth/signing",
  async (loginRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/auth/signing", loginRequest);
      console.log("response:", response.data);

      const token = response.data.jwt;
      if (token) {
        
        localStorage.setItem("jwt", token);

       
        dispatch(fetchSellerProfile(token));
      }

      return response.data;
    } catch (error: any) {
      console.log("error ---", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  loading: false,
  otpSent: false,
  user: null as any,
  error: null as string | null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // OTP
    builder.addCase(sendLoginSignupOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendLoginSignupOtp.fulfilled, (state) => {
      state.loading = false;
      state.otpSent = true;
    });
    builder.addCase(sendLoginSignupOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // SIGNIN
    builder.addCase(signing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signing.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default authSlice.reducer;
