
import React, { useEffect, useState } from "react";
import CartItemCart from "./CartItemCart";
import PricingCard from "./PricingCard";
import { Button, IconButton, TextField } from "@mui/material";
import { Close, LocalOffer } from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchUserCart,
  applyCoupon,
  removeCoupon,
} from "../../../State/customer/cartSlice";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const { jwt, role } = useAppSelector((state) => state.auth);

  // Fetch cart
  useEffect(() => {
    if (jwt && role) {
      dispatch(fetchUserCart({ jwt, role }));
    }
  }, [dispatch, jwt, role]);

  // Apply coupon
  const handleApplyCoupon = () => {
    if (!couponCode || !jwt) return alert("Please enter a coupon code");

    dispatch(applyCoupon({ jwt, couponCode }));
    setCouponCode("");
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    if (!jwt || !cart?.couponCode) return;

    dispatch(
      removeCoupon({
        jwt,
        couponCode: cart.couponCode,
      })
    );
  };

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-3">
          {cart?.cartItems?.map((item) => (
            <CartItemCart key={item.id} item={item} />
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-3">

          {/* COUPON BOX */}
          <div className="border rounded-md px-5 py-3 space-y-4">
            <div className="flex items-center gap-2">
              <LocalOffer sx={{ color: teal[600], fontSize: 18 }} />
              <span>Apply Coupon</span>
            </div>

            {/* SHOW IF COUPON APPLIED */}
            {cart?.couponCode ? (
              <div className="flex items-center justify-between border p-2 rounded-md">
                <span className="text-green-600 font-semibold">
                  {cart.couponCode} Applied
                </span>

                <IconButton size="small" onClick={handleRemoveCoupon}>
                  <Close className="text-red-600" />
                </IconButton>
              </div>
            ) : (
              // INPUT BOX
              <div className="flex gap-2">
                <TextField
                  size="small"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </Button>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* PRICING */}
          <div className="border rounded-md">
            {/* <PricingCard cart={cart?.cartItems || []} /> */}
            <PricingCard cart={cart} />

            <div className="p-5">
              <Button
                fullWidth
                variant="contained"
                sx={{ py: "11px" }}
                disabled={loading || !(cart?.cartItems?.length)}
                onClick={() => navigate("/checkout")}
              >
                Buy Now
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;