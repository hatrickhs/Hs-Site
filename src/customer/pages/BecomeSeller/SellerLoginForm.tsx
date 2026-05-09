
import React from "react";
import { Alert, Button, Snackbar, TextField, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { sendLoginSignupOtp, signing } from "../../../State/seller/AuthSlice";

const SellerLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { auth } = useAppSelector((store) => store);

  const [open, setOpen] = React.useState(false);
  const [otpLoading, setOtpLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: (values) => {
      dispatch(
        signing({
          email: values.email,
          otp: String(values.otp),
        })
      );
    },
  });

  const handleSendOtp = async () => {
    if (!formik.values.email || otpLoading) return;

    setOtpLoading(true);
    await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
    setOtpLoading(false);
  };

  /* 🔔 Snackbar open when message changes */
  React.useEffect(() => {
    if (auth.message) {
      setOpen(true);
    }
  }, [auth.message]);

  /* 🚀 Redirect seller after success */
  React.useEffect(() => {
    if (auth.jwt && auth.role === "ROLE_SELLER") {
      const timer = setTimeout(() => {
        navigate("/seller");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [auth.jwt, auth.role, navigate]);

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-5">
        Login As Seller
      </h1>

      <div className="space-y-5">
        {/* EMAIL */}
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />

        {/* OTP FIELD */}
        {auth.otpSent && (
          <div className="space-y-2">
            <p className="font-medium text-sm opacity-60">
              Enter OTP sent to your Email
            </p>
            <TextField
              fullWidth
              name="otp"
              label="OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
            />
          </div>
        )}

        {/* SEND OTP */}
        {!auth.otpSent && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            disabled={otpLoading}
            sx={{ py: "11px" }}
          >
            {otpLoading ? "Sending..." : "Send OTP"}
          </Button>
        )}

        {/* LOGIN */}
        {auth.otpSent && (
          <Button
            fullWidth
            variant="contained"
            onClick={() => formik.handleSubmit()}
            sx={{ py: "11px" }}
          >
            {auth.loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        )}

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert
  severity={auth.messageType || "success"}
  onClose={() => setOpen(false)}
>
  {auth.message}
</Alert>

        </Snackbar>

      </div>
    </div>
  );
};

export default SellerLoginForm;
