
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
  // const jwt = localStorage.getItem("jwt");
  // const { cart, loading } = useAppSelector((state) => state.cart);
  const { jwt, role } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   if (jwt) dispatch(fetchUserCart(jwt));
  // }, [dispatch, jwt]);

  useEffect(() => {
    if (jwt && role) {
      dispatch(fetchUserCart({ jwt, role })); 
    }
  }, [dispatch, jwt, role]);

  const handleApplyCoupon = () => {
    if (!couponCode || !jwt) return alert("Please enter a coupon code");
    dispatch(applyCoupon({ jwt, couponCode }));
    setCouponCode("");
  };

  // const handleRemoveCoupon = () => {
  //   if (!jwt) return;
  //   dispatch(removeCoupon({
  //     jwt,
  //     couponCode: ""
  //   }));
  const handleRemoveCoupon = () => {
    if (!jwt || !cart?.code) return;
    dispatch(removeCoupon({
      jwt,
      couponCode: cart.code
    }));
  };

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart?.cartItems?.map((item) => (
            <CartItemCart key={item.id} item={item} />
          ))}
        </div>

        {/* Right Section */}
        <div className="space-y-3">
          {/* Coupon */}
          <div className="border rounded-md px-5 py-3 space-y-4">
            <div className="flex items-center gap-2">
              <LocalOffer sx={{ color: teal[600], fontSize: 18 }} />
              <span>Apply Coupon</span>
            </div>

            {cart?.code ? (
              <div className="flex items-center gap-2 border p-2 rounded-md">
                <span>{cart.code} Applied</span>
                <IconButton size="small" onClick={handleRemoveCoupon}>
                  <Close className="text-red-600" />
                </IconButton>
              </div>
            ) : (
              <div className="flex gap-2">
                <TextField
                  size="small"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                />
                <Button size="small" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>
            )}
            {error && (
              <p className="text-red-600 text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="border rounded-md">
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
