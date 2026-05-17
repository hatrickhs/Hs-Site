
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { fetchSellerProfile } from "./sellerSlice";

/*  OTP */
export const sendLoginSignupOtp = createAsyncThunk(
  "auth/sendLoginSignupOtp",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/sent/login-signup-otp", { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

/*  LOGIN  */
export const signing = createAsyncThunk(
  "auth/signing",
  async (loginRequest: { email: string; otp: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signing", loginRequest);

      const data = response.data;

      if (data?.jwt) {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("role", data.role || "");
      }

      // fetch profile after login
      if (data?.jwt) {
        const profile = await dispatch(
          fetchUserProfile({ jwt: data.jwt })
        ).unwrap();

        localStorage.setItem("user", JSON.stringify(profile));

        if (data.role === "ROLE_SELLER") {
          localStorage.setItem("sellerProfile", JSON.stringify(profile));
        }
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Invalid OTP");
    }
  }
);

/*  SIGNUP */
export const signup = createAsyncThunk(
  "auth/signup",
  async (signupRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", signupRequest);

      if (response.data?.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("role", response.data.role || "");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

/*  PROFILE  */
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async ({ jwt }: { jwt: string }, { rejectWithValue }) => {
    try {
      const role = localStorage.getItem("role");

      const url =
        role === "ROLE_SELLER" ? "/sellers/profile" : "/api/users/profile";

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Profile fetch failed");
    }
  }
);

/*  LOGOUT  */
export const logout = createAsyncThunk(
  "auth/logout",
  async (navigate: Function) => {
    localStorage.clear();
    navigate("/login");
    return true;
  }
);

/*  TYPES */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  mobile?: string;
}

interface AuthState {
  jwt: string | null;
  otpSent: boolean;
  isLoggedIn: boolean;
  user: User | null;
  role: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  messageType: "success" | "error" | null;
}

/*  INITIAL STATE  */
const initialState: AuthState = {
  jwt: localStorage.getItem("jwt"),
  otpSent: false,
  isLoggedIn: !!localStorage.getItem("jwt"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  role: localStorage.getItem("role"),
  loading: false,
  error: null,
  message: null,
  messageType: null,
};

/*  SLICE  */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    /*  OTP  */
    builder.addCase(sendLoginSignupOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
      state.messageType = null;
    });

    builder.addCase(sendLoginSignupOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.otpSent = true;
      state.message = action.payload.message || "OTP sent successfully";
      state.messageType = "success";
    });

    builder.addCase(sendLoginSignupOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = state.error;
      state.messageType = "error";
    });

    /* LOGIN  */
    builder.addCase(signing.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });

    builder.addCase(signing.fulfilled, (state, action) => {
      state.loading = false;
      state.jwt = action.payload.jwt;
      state.isLoggedIn = true;
      state.role = action.payload.role || null;
      state.message = "Login successful";
      state.messageType = "success";

      //  user from localStorage
      state.user = JSON.parse(localStorage.getItem("user") || "null");
    });

    builder.addCase(signing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.message = state.error;
      state.messageType = "error";
    });

    /* SIGNUP  */
    builder.addCase(signup.fulfilled, (state, action) => {
      state.jwt = action.payload.jwt;
      state.isLoggedIn = true;
      state.role = action.payload.role || null;
      state.user = JSON.parse(localStorage.getItem("user") || "null");
    });

    /*  PROFILE  */
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload?.user || action.payload;
      state.jwt = localStorage.getItem("jwt");
      state.role = localStorage.getItem("role");
      state.isLoggedIn = true;
      state.loading = false;
    });

    /*  LOGOUT  */
    builder.addCase(logout.fulfilled, (state) => {
      state.jwt = null;
      state.isLoggedIn = false;
      state.user = null;
      state.role = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export default authSlice.reducer;