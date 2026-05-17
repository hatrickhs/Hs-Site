
import React from "react";
import { Cart } from "../../../State/types/cartTypes";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../Util/sumCartItemMrpPrice";
import { Divider } from "@mui/material";
import { useAppSelector } from "../../../State/Store";

interface PricingCardProps {
  cart: Cart | null;
}

const PricingCard = ({ cart }: PricingCardProps) => {
  console.log("CART:", cart);

  const totalMrp = sumCartItemMrpPrice(cart?.cartItems || []);
  const totalSelling = sumCartItemSellingPrice(cart?.cartItems || []);

  // product discount (MRP - selling)
  const productDiscount = totalMrp - totalSelling;

  // coupon discount from backend
  const cartDiscount = cart?.couponDiscount || 0;

  // final total
  const total = totalSelling - cartDiscount;

  const { success, error } = useAppSelector(
    (state) => state.adminCoupon
  );

  return (
    <>
      <div className="space-y-3 p-5">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{totalMrp}</span>
        </div>

        {/* Product Discount */}
        {productDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Product Discount</span>
            <span>- ₹{productDiscount}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {cartDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>- ₹{cartDiscount}</span>
          </div>
        )}
      </div>

      <Divider />

      {/* Total */}
      <div className="flex justify-between p-5 font-bold text-lg">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      {/* Messages */}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {success}
        </p>
      )}

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}
    </>
  );
};

export default PricingCard;