import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import PricingCard from "../Cart/PricingCard";
import { useAppSelector } from "../../../State/Store";
import { useNavigate } from "react-router-dom";
import Address from "../Account/Address";

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
  {
    value: "RAZORPAY",
    label: "Razorpay",
    image:
      "https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png",
  },
];

const CheckOut = () => {
  const token = useAppSelector((state) => state.auth.jwt);
  const { cart } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();


  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data);
        if (response.data.length > 0) setSelectedAddress(response.data[0]);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };
    fetchAddresses();
  }, [token]);

  const handleSaveAddress = (newAddress: any) => {
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setOpen(false);
  };

      <div>
        <h2 className="font-semibold mb-3">Select Address</h2>

        <Address
          onSelect={(addr: any) => setSelectedAddress(addr)}
        />

        {selectedAddress && (
          <p className="text-sm text-green-600 mt-2">
            Selected Address ID: {selectedAddress.id}
          </p>
        )}
      </div>

  const handleRemoveAddress = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      if (selectedAddress?.id === id) setSelectedAddress(null);
    } catch (err) {
      console.error("Address remove failed:", err);
      alert("Address remove failed.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    try {
      const payload = { addressId: selectedAddress.id, cartItems: cart };

      const response = await axios.post(
        `http://localhost:5000/api/orders?paymentMethod=${paymentMethod}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentMethod === "CASH_ON_DELIVERY") {
          const orderId = response.data.orderId;
        alert("Order placed successfully (Cash on Delivery)");

         navigate(`/payment-success/${orderId}`);
         console.log("Order Response:", response.data);

      }

      if (paymentMethod === "RAZORPAY") {
        const orderId = response.data.orderId;
        const paymentLinkUrl = response.data.paymentLinkUrl;
        if (paymentLinkUrl) window.location.href = paymentLinkUrl;
        else alert("Payment link not found!");
        //  navigate(`/payment-success/${orderId}`);
         console.log("Order Response:", response.data);
      }
    } catch (err: any) {
      console.error("Checkout failed:", err.response || err);
      alert("failed to checkout");
    }
  };

  return (
    <>
      <div className="pt-10 px-5 lg:px-40 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-10">
         
          <div className="flex-1 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Select Address</h1>
              <Button onClick={() => setOpen(true)}>Add new Address</Button>
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

          <div className="w-full lg:w-[35%]">
            <div className="border rounded-md shadow-md p-5 bg-white">
              <h1 className="text-center font-medium pb-3">Choose Payment Method</h1>

              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentOptions.map((opt) => (
                  <FormControlLabel
                    key={opt.value}
                    value={opt.value}
                    control={<Radio />}
                    label={
                      opt.image ? (
                        <img src={opt.image} alt={opt.label} className="h-8 object-contain"/>
                      ) : (
                        opt.label
                      )
                    }
                  />
                ))}
              </RadioGroup>

              <PricingCard cart={cart || []} />

              <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <AddressForm onSave={handleSaveAddress} />
        </Box>
      </Modal>
    </>
  );
};

export default CheckOut;


