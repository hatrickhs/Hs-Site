import React, { useEffect } from "react";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../State/Store";
import { paymentSuccess } from "../../State/customer/orderSlice";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Utility to get query params
  const getQueryParam = (key: string) => {
    const query = new URLSearchParams(location.search);
    return query.get(key);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || "";
    const paymentId = getQueryParam("razorpay_payment_id");
    const paymentLinkId = getQueryParam("razorpay_payment_link_id");

    if (jwt && paymentId && paymentLinkId) {
      dispatch(paymentSuccess({ jwt, paymentId, paymentLinkId }));
    }
  }, [location.search, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center animate-scaleIn relative overflow-hidden">

        {/* Confetti Animation */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-yellow-400 rounded-full animate-fall`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ["#22c55e", "#facc15", "#38bdf8"][i % 3],
              }}
            />
          ))}
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6 z-10 relative">
          <CheckCircleIcon sx={{ fontSize: 100, color: "#22c55e" }} className="animate-pop" />
        </div>

        {/* Titles */}
        <h1 className="text-4xl font-bold text-gray-800 mb-3 z-10 relative">Payment Successful 🎉</h1>
        <p className="text-gray-600 mb-8 z-10 relative">
          Your order has been placed successfully!
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 z-10 relative">
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => navigate("/account/orders")}
          >
            View Orders
          </Button>

          <Button
            variant="outlined"
            color="success"
            size="large"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-scaleIn {
            animation: scaleIn 0.6s ease-out;
          }
          .animate-pop {
            animation: pop 0.8s ease-out;
          }

          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          @keyframes pop {
            0% { transform: scale(0); }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          @keyframes fall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
          }
          .animate-fall {
            animation: fall 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default PaymentSuccess;
