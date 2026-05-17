
import { Add, Close, Remove } from '@mui/icons-material';
import { Button, Divider, IconButton } from '@mui/material';
import React from 'react';
import { CartItem } from '../../../State/types/cartTypes';
import { useAppDispatch } from '../../../State/Store';
import { updateCartItem, deleteCartItem } from '../../../State/customer/cartSlice';

const CartItemCart = ({ item }: { item: CartItem }) => {
  console.log("CART ITEM:", item);
  console.log("DEAL DATA:", item.deal);
  console.log("IMAGE:", item.deal?.images?.[0]);
  console.log("PRODUCT:", item.product);
  console.log("CART ITEM:", item);
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");



  const handleUpdateQuantity = (value: number) => () => {
    if (!jwt) return;

    dispatch(updateCartItem({
      jwt,
      cartItemId: item.id,
      cartItem: {
        quantity: item.quantity + value,
        productId: item.product?.id || null,
        dealId: item.deal?.id || null,
      }
    }));
  };

  const handleDeleteItem = () => {
    if (!jwt) return;
    dispatch(deleteCartItem({ jwt, cartItemId: item.id }));
  };

  return (
    <div className='border rounded-md relative'>
      <div className='p-5 flex gap-3'>
        <img className='w-[90px] rounded-md' src={item.product?.images?.[0] || item.deal?.images?.[0] || "/placeholder.png"} alt={item.product?.title || "product"} />
        <div className='space-y-2'>
          {/* <h1 className='font-semibold text-lg'>{item.product.seller?.sellerName || "Unknown Seller"}</h1> */}
          <h1 className='font-semibold text-lg'>
            {item?.product?.seller?.sellerName || item?.deal?.name || "Unknown Seller"}
          </h1>
          <p className='text-gray-600 font-medium text-sm'>{item.product?.title}</p>
          <p className='text-gray-400 text-xs'><strong>Sold by:</strong> Natural Lifestyle Products Private Limited</p>
          <p className='text-sm'>7 days replacement available</p>
          <p className='text-sm text-gray-500'><strong>Quantity:</strong> {item.quantity}</p>
        </div>
      </div>

      <Divider />

      <div className='flex justify-between items-center px-5 py-2'>
        <div className='flex items-center gap-2 w-[140px] justify-between'>
          <Button onClick={handleUpdateQuantity(-1)} disabled={item.quantity <= 1}><Remove /></Button>
          <span>{item.quantity}</span>
          <Button onClick={handleUpdateQuantity(1)}><Add /></Button>
        </div>
        <div>
          <p className='text-gray-700 font-medium'>₹{item.sellingPrice}</p>
        </div>
      </div>

      <div className='absolute top-1 right-1'>
        <IconButton color='primary' onClick={handleDeleteItem}><Close /></IconButton>
      </div>
    </div>
  );
};

export default CartItemCart;
