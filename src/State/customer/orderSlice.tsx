import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderItem, OrderState } from "../types/orderType";
import { api } from "../../config/Api";
import { string } from "yup";
import axios from "axios";
import { Address } from "../types/userTypes";

const initialState: OrderState = {
  orders: [],
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
  loading: false,
  error: null,
  orderCanceled: false
};

const API_URL = "/api/orders";

export const fetchUserOrderHistory = createAsyncThunk<Order[], string>(
  "orders/fetchUserOrderHistory",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("order history fetched", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      return rejectWithValue(error.response?.data.error || "Failed to fetch order history");
    }
  }
);

export const fetchOrderById = createAsyncThunk<
  Order,
  { orderId: number; jwt: string }
>(
  "orders/fetchOrderById",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("order fetched ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      return rejectWithValue(error.response?.data.error || "Failed to fetch order");
    }
  }
);

export const createOrder = createAsyncThunk<
  any,
  { address: Address; jwt: string, paymentGateway: string }
>(
  "orders/createOrder",
  async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/orders?paymentMethod=${encodeURIComponent(paymentGateway)}`, 
        address,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("order created", response.data);

      if (response.data.payment_link_url) {
        window.location.href = response.data.payment_link_url
      }

      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      return rejectWithValue("Failed to create order");
    }
  }
);


export const fetchOrderItemById = createAsyncThunk<
  OrderItem,
  { orderItemId: number; jwt: string }
>(
  "orders/fetchOrderItemById",
  async ({ orderItemId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/item/${orderItemId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("order item fetched", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue("Failed to create order");
    }
  }
);

export const paymentSuccess = createAsyncThunk<
  any,
  { paymentId: string; jwt: string, paymentLinkId: string },
  { rejectValue: string }
>(
  "orders/paymentSuccess",
  async ({ paymentId, jwt, paymentLinkId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payment/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: { paymentLinkId }
      });

      console.log("payment success", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error ", error.response)
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to process payment");
    }
  }
);

export const cancelOrder = createAsyncThunk<Order, { orderId: number }>(
  "orders/cancelOrder",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      
      const response = await api.put(`/api/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      console.log("cancel order", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to order cancelled");
    }
  }
);

export const removeOrderItem = createAsyncThunk<
  { orderId: number; orderItemId: number },
  { orderId: number; orderItemId: number; jwt: string }
>(
  "orders/removeOrderItem",
  async ({ orderId, orderItemId, jwt }) => {
    await api.delete(
      `/api/orders/${orderId}/item/${orderItemId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return { orderId, orderItemId };
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearAllOrders: (state) => {
    state.orders = [];
    state.currentOrder = null;
    state.orderItem = null;
    state.paymentOrder = null;
    state.error = null;
    state.orderCanceled = false;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCanceled = false;
      })

      .addCase(
        fetchUserOrderHistory.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )

      .addCase(
        fetchUserOrderHistory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )


      .addCase(
        fetchOrderById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )


      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.currentOrder = action.payload;
          state.loading = false;
        }
      )


      .addCase(
        fetchOrderById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )


      .addCase(
        createOrder.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.paymentOrder = action.payload;
          state.loading = false;

          // COD case
          if (!action.payload.payment_link_url) {
            state.currentOrder = action.payload; 
            state.orders.push(action.payload);   
          }
        }
      )

      .addCase(
        createOrder.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )


      .addCase(
        fetchOrderItemById.pending, (state) => {
          state.loading = true;
          state.error = null;
        }
      )


      .addCase(
        fetchOrderItemById.fulfilled, (state, action) => {
          state.loading = false;
          state.orderItem = action.payload;
        }
      )


      .addCase(
        fetchOrderItemById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )

      .addCase(
        paymentSuccess.pending, (state, action) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        paymentSuccess.fulfilled, (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.currentOrder = action.payload; 
          state.orders.push(action.payload);   
          console.log("Payment successful:", action.payload);
        }
      )

      .addCase(
        paymentSuccess.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )

      .addCase(
        cancelOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.orderCanceled = false;
        }
      )

      .addCase(
        cancelOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.orders = state.orders.map((order) =>
            order.id === action.payload.id ? action.payload : order
          );
          state.orderCanceled = true;
          state.currentOrder = action.payload
        }
      )

      .addCase(
        cancelOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )

      .addCase(removeOrderItem.fulfilled, (state, action) => {
        const { orderId, orderItemId } = action.payload;

        // orders list update
        state.orders = state.orders
          .map(order =>
            order.id === orderId
              ? {
                ...order,
                orderItems: order.orderItems.filter(
                  item => item.id !== orderItemId
                ),
              }
              : order
          )
          // REMOVE EMPTY ORDERS (HEADER GONE)
          .filter(order => order.orderItems.length > 0);

        // currentOrder update
        if (state.currentOrder?.id === orderId) {
          state.currentOrder.orderItems =
            state.currentOrder.orderItems.filter(
              item => item.id !== orderItemId
            );

          if (state.currentOrder.orderItems.length === 0) {
            state.currentOrder = null;
          }
        }
      });

  }

})

export default orderSlice.reducer;