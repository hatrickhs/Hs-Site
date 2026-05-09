import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { fetchSellerProfile } from "./sellerSlice";

// OTP request
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

// Signing (login)
export const signing = createAsyncThunk(
  "auth/signing",
  async (
    loginRequest: { email: string; otp: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/signing", loginRequest);

      if (response.data?.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
        if (response.data.role) {
          localStorage.setItem("role", response.data.role);
        }

        // fetch profile 
        const profile = await dispatch(
          fetchUserProfile({ jwt: response.data.jwt })
        ).unwrap();

        if (response.data.role === "ROLE_SELLER") {
          localStorage.setItem("sellerProfile", JSON.stringify(profile));
        } else {
          localStorage.setItem("user", JSON.stringify(profile));
        }
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Invalid OTP");
    }
  }
);

// Signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (signupRequest: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", signupRequest);
      localStorage.setItem("jwt", response.data.jwt);
      if (response.data.role) localStorage.setItem("role", response.data.role);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async ({ jwt }: { jwt: string }, { rejectWithValue }) => {
    try {
      const role = localStorage.getItem("role");

      const url =
        role === "ROLE_SELLER" ? "/sellers/profile" : "api/users/profile";

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (navigate: Function) => {
    localStorage.clear();
    navigate("/login");
    return true;
  }
);

// Types
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

const initialState: AuthState = {
  jwt: localStorage.getItem("jwt") || null,
  otpSent: false,
  isLoggedIn: !!localStorage.getItem("jwt"),
  user: localStorage.getItem("user")
         ? JSON.parse(localStorage.getItem("user")!)
         : null,
  role: localStorage.getItem("role") || null,
  loading: false,
  error: null,
  message: null,
  messageType: null,
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
      state.message = null;
      state.messageType = null;

    });
    builder.addCase(sendLoginSignupOtp.fulfilled, (state,action) => {
      state.loading = false;
      state.otpSent = true;
      state.error = null; 
      state.message = action.payload.message || "OTP sent successfully";
      state.messageType = "success";
    });
    builder.addCase(sendLoginSignupOtp.rejected, (state, action) => {
      state.loading = false;
       state.error = action.payload as string;
       state.message = state.error;
       state.messageType = "error";
    });

    // Signing
    builder.addCase(signing.pending, (state) => {
      state.loading = true;
      state.error = null;     
  state.message = null; 
    });
    builder.addCase(signing.fulfilled, (state, action) => {
      console.log("Login response:", action.payload);
      state.loading = false;
      state.jwt = action.payload.jwt;
      state.isLoggedIn = true;
      state.user = action.payload.user || null;
      state.role = action.payload.role || state.role;
      state.error = null;
      state.message = action.payload.message || "Login successful";
       state.messageType = "success"; 

      if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user));
  }
      if (state.role) {
        localStorage.setItem("role", state.role);
      }
      
    });
    builder.addCase(signing.rejected, (state, action) => {
      state.loading = false;
       state.error = action.payload as string;
      state.message = state.error;
      state.messageType = "error";
    });

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
       state.message = null; 
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.jwt = action.payload.jwt;
      state.isLoggedIn = true;
      state.user = action.payload.user || null;
      state.role = action.payload.role || null;
      if (state.role) localStorage.setItem("role", state.role);
      state.message = action.payload.message || "Signup successful";
       state.messageType = "success";
        if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user));
  }
   if (state.role) localStorage.setItem("role", state.role);
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Signup failed";
      state.message = state.error;
       state.messageType = "error";
    });

    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      console.log("Profile fetched:", action.payload);
      state.user = action.payload.user || action.payload;
      state.isLoggedIn = true;
      state.jwt = localStorage.getItem("jwt");
      state.role = action.payload.role || localStorage.getItem("role");
      state.loading = false;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to fetch profile";
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.jwt = null;
      state.isLoggedIn = false;
      state.user = null;
      state.role = null;
      state.loading = false;
      state.error = null;

       localStorage.removeItem("jwt");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("sellerProfile"); 
    });
  },
});

export default authSlice.reducer;


