
import React from 'react';
import { Cart } from '../../../State/types/cartTypes';
import { sumCartItemMrpPrice, sumCartItemSellingPrice } from '../../../Util/sumCartItemMrpPrice';
import { Divider } from '@mui/material';
import { useAppSelector } from '../../../State/Store';

interface PricingCardProps {
  cart: Cart | null;
}

const PricingCard = ({ cart }: PricingCardProps) => {
  console.log("CART ITEMS:", cart?.cartItems);
  console.log("CART ITEMS RAW:", cart?.cartItems);
console.log("CART ITEM IDS:", cart?.cartItems?.map(i => i.id));
  // console.log(cart);

  const totalMrp = cart ? sumCartItemMrpPrice(cart.cartItems) : 0;
  const totalSelling = cart ? sumCartItemSellingPrice(cart.cartItems) : 0;
  const cartDiscount = cart?.couponDiscount || 0; 
  const productDiscount = totalMrp - totalSelling;
  const total = totalSelling - cartDiscount;
  const { success, error } = useAppSelector(state => state.adminCoupon);

    console.log("MRP:", totalMrp);
  console.log("Selling:", totalSelling);
  console.log("Product Discount:", productDiscount);
  console.log("Cart Discount:", cartDiscount);

  return (
    <>
      <div className='space-y-3 p-5'>
        <div className='flex justify-between'>
          <span>Subtotal</span>
          <span>₹{totalMrp}</span>
        </div>
        {productDiscount > 0 && (
          <div className='flex justify-between text-green-600'>
            <span>Product Discount</span>
            <span>- ₹{productDiscount}</span>
          </div>
        )}
        {cartDiscount > 0 && (
          <div className='flex justify-between text-green-600'>
            <span>Coupon Discount</span>
            <span>- ₹{cartDiscount}</span>
          </div>
        )}
      </div>

      <Divider />

      <div className='flex justify-between p-5 text-primary-color font-bold'>
        <span>Total</span>
        <span>₹{total}</span>
      </div>
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
