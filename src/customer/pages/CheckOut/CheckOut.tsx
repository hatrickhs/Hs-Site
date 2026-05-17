
import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import PricingCard from "../Cart/PricingCard";
import { useAppSelector, useAppDispatch } from "../../../State/Store";
import { useNavigate } from "react-router-dom";
import { fetchUserCart } from "../../../State/customer/cartSlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const paymentOptions = [
  { value: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
  { value: "RAZORPAY", label: "Razorpay" },
];

const CheckOut = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { jwt, role } = useAppSelector((state) => state.auth);
  const { cart, loading } = useAppSelector((state) => state.cart);

  const cartItems = cart?.cartItems || [];

  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");

  //  CART FETCH (IMPORTANT FIX) 
  useEffect(() => {
    if (jwt && role) {
      dispatch(fetchUserCart({ jwt, role }));
    }
  }, [jwt, role, dispatch]);

  // ADDRESS FETCH 
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/addresses/all",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      setAddresses(res.data);

      if (res.data.length > 0 && !selectedAddress) {
        setSelectedAddress(res.data[0]);
      }
    } catch (err) {
      console.error("Address fetch failed", err);
    }
  };

  useEffect(() => {
    if (jwt) fetchAddresses();
  }, [jwt]);

  // SAVE ADDRESS 
  const handleSaveAddress = () => {
    fetchAddresses();
    setOpen(false);
  };

  //  DELETE ADDRESS 
  const handleRemoveAddress = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/addresses/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      fetchAddresses();

      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  //  CHECKOUT 
  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    try {
      const items = cartItems.map((item: any) => ({
        productId: item.product?.id,
        quantity: item.quantity,
      }));

      const payload = {
        addressId: selectedAddress.id,
        cartItems: items,
      };

      const res = await axios.post(
        `http://localhost:5000/api/orders?paymentMethod=${paymentMethod}`,
        payload,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      const orderId = res.data.orderId;

      if (paymentMethod === "CASH_ON_DELIVERY") {
        alert("Order placed successfully");
        navigate(`/payment-success/${orderId}`);
      }

      if (paymentMethod === "RAZORPAY") {
        window.location.href = res.data.paymentLinkUrl;
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed");
    }
  };

  // LOADING FIX 
  if (!cart) {
    return <div className="p-10">Loading cart...</div>;
  }

  return (
    <>
      <div className="pt-10 px-5 lg:px-40 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT - ADDRESS */}
          <div className="flex-1 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Select Address</h1>
              <Button onClick={() => setOpen(true)}>
                Add new Address
              </Button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  selected={selectedAddress?.id === addr.id}
                  onSelect={setSelectedAddress}
                  onRemove={handleRemoveAddress}
                />
              ))}
            </div>
          </div>

          {/* RIGHT - PAYMENT */}
          <div className="w-full lg:w-[35%]">
            <div className="border rounded-md shadow-md p-5 bg-white">

              <h1 className="text-center font-medium pb-3">
                Payment Method
              </h1>

              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentOptions.map((opt) => (
                  <FormControlLabel
                    key={opt.value}
                    value={opt.value}
                    control={<Radio />}
                    label={opt.label}
                  />
                ))}
              </RadioGroup>

              {/* IMPORTANT FIX */}
              <PricingCard cart={cart} />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading || cartItems.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>

            </div>
          </div>

        </div>
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <AddressForm onSave={handleSaveAddress} />
        </Box>
      </Modal>
    </>
  );
};

export default CheckOut;