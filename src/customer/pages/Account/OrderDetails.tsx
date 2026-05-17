
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchOrderById,
  fetchOrderItemById,
  cancelOrder
} from "../../../State/customer/orderSlice";

import { Box, Button, Divider } from "@mui/material";
import OrderSteper from "./OrderSteper";
import { Payment } from "@mui/icons-material";

const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orderId, orderItemId } = useParams();

  const { orderItem, currentOrder, orderCanceled } = useAppSelector(
    (state) => state.order
  );

  //  Fetch order + item
  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || "";

    if (orderId) {
      dispatch(
        fetchOrderById({
          orderId: Number(orderId),
          jwt
        })
      );
    }

    if (orderItemId) {
      dispatch(
        fetchOrderItemById({
          orderItemId: Number(orderItemId),
          jwt
        })
      );
    }
  }, [orderId, orderItemId, dispatch]);

  // Cancel order
  const handleCancelOrder = () => {
    if (currentOrder?.id) {
      dispatch(cancelOrder({ orderId: currentOrder.id }));
    }
  };

  // SAFE PRICE LOGIC (FIXED HERE)
  const mrp =
    orderItem?.product?.mrpPrice ??
    orderItem?.deal?.mrpPrice ??
    0;

  const sellingPrice =
    orderItem?.product?.sellingPrice ??
    orderItem?.deal?.sellingPrice ??
    0;

  const quantity = orderItem?.quantity ?? 1;

  const totalItemPrice = sellingPrice * quantity;

  const youSaved =
    mrp && sellingPrice
      ? ((mrp - sellingPrice) * quantity).toFixed(2)
      : "0.00";

  return (
    <Box>
      {/*  Product Info */}
      <section className="flex flex-col gap-5 justify-center items-center">
        <img
          className="w-[100px]"
          src={
            orderItem?.product?.images?.[0] ||
            orderItem?.deal?.images?.[0] ||
            "https://via.placeholder.com/100"
          }
          alt={orderItem?.product?.title || orderItem?.deal?.name || "Product"}
        />

        <div className="text-sm space-y-1 text-center">
          <h1 className="font-bold">
            {orderItem?.product?.seller?.businessDetails?.businessName || ""}
          </h1>
          <p>{orderItem?.product?.title || orderItem?.deal?.name || ""}</p>
        </div>

        {/*  Write Review */}
        <Button
          disabled={!orderItem?.product?.id && !orderItem?.deal?.id}
          onClick={() => {
            if (orderItem?.product?.id) {
              navigate(`/products/${orderItem.product.id}/review`);
            } else if (orderItem?.deal?.id) {
              navigate(`/deal/${orderItem.deal.id}/review`);
            }
          }}
        >
          Write Review
        </Button>
      </section>

      {/*  Order Stepper */}
      <section className="border p-5">
        <OrderSteper
          orderStatus={currentOrder?.orderStatus || "PENDING"}
        />
      </section>

      {/*  Address */}
      <div className="border p-5">
        <h1 className="font-bold pb-3">Delivery Address</h1>

        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>{currentOrder?.shippingAddress?.name || "N/A"}</p>
            <Divider flexItem orientation="vertical" />
            <p>{currentOrder?.shippingAddress?.mobile || "N/A"}</p>
          </div>

          <p>
            {currentOrder?.shippingAddress?.address || "N/A"},{" "}
            {currentOrder?.shippingAddress?.state || "N/A"},{" "}
            {currentOrder?.shippingAddress?.city || "N/A"} -{" "}
            {currentOrder?.shippingAddress?.pinCode || "N/A"}
          </p>
        </div>
      </div>

      {/*  Price Section */}
      <div className="border space-y-4">
        <div className="flex justify-between text-sm pt-5 px-5">
          <div className="space-y-1">
            <p className="font-bold">
              Total Item Price ₹{totalItemPrice}
            </p>

            <p>
              You saved{" "}
              <span className="text-green-500 text-xs font-medium">
                ₹ {youSaved}
              </span>{" "}
              on this item
            </p>
          </div>

          <p className="font-medium">₹{totalItemPrice}</p>
        </div>

        {/*  Payment */}
        <div className="px-5">
          <div className="bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3">
            <Payment />
            <p>Pay on Delivery</p>
          </div>
        </div>

        <Divider />

        {/*  Seller */}
        <div className="px-5 pb-5">
          {/* <p className="text-xs">
            <strong>Sold by: </strong>
            {orderItem?.product?.seller?.businessDetails?.businessName ||
              orderItem?.product?.seller?.sellerName || orderItem?.deal?.seller?.sellerName ||
              "UnKown Seller"}
          </p> */}
        </div>

        {/*  Cancel Button */}
        <div className="p-10">
          <Button
            onClick={handleCancelOrder}
            disabled={
              orderCanceled ||
              !currentOrder ||
              currentOrder?.orderStatus === "DELIVERED"
            }
            color="error"
            variant="outlined"
            fullWidth
            sx={{ py: "0.7rem" }}
          >
            {orderCanceled ? "Order Canceled" : "Cancel Order"}
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default OrderDetails;