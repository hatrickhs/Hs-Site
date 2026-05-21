import React from 'react'
import store, { useAppDispatch, useAppSelector } from '../../../State/Store'
import { useFormik } from 'formik'
import SellerLoginForm from '../BecomeSeller/SellerLoginForm'
import { useNavigate } from 'react-router-dom'
import { sendLoginSignupOtp, signing } from '../../../State/seller/AuthSlice'
import { Button, CircularProgress, TextField } from '@mui/material'
import { Snackbar, Alert } from "@mui/material";
import { useLocation } from "react-router-dom";
import { addItemToCart } from '../../../State/customer/cartSlice'
import { addProductToWishlist } from '../../../State/customer/WishlistSlice'

interface LoginFormProps {
    from?: string; // redirect path
}

const LoginForm: React.FC<LoginFormProps> = ({ from }) => {
    const dispatch = useAppDispatch()
    const { auth } = useAppSelector(store => store)
    const navigate = useNavigate()
    const [otpLoading, setOtpLoading] = React.useState(false)
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const pendingProduct = location.state?.pendingProduct;

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: ""
        },
        onSubmit: async (values) => {
            console.log("form data", values)

            dispatch(signing(values))
        }
    })


    const handleSendOtp = async () => {
        dispatch(sendLoginSignupOtp({ email: formik.values.email }))
    }

    React.useEffect(() => {
        if (auth.jwt && auth.role) {

            localStorage.setItem("jwt", auth.jwt);

            const pendingWishlist = localStorage.getItem("pendingWishlist");

            if (pendingWishlist) {
                dispatch(
                    addProductToWishlist({
                        productId: Number(pendingWishlist),
                    })
                );

                localStorage.removeItem("pendingWishlist");
            }

            if (pendingProduct) {
                dispatch(
                    addItemToCart({
                        jwt: auth.jwt,
                        request: pendingProduct,
                    })
                );
            }

            const timer = setTimeout(() => {

                if (auth.role === "ROLE_ADMIN") {
                    navigate("/admin");
                } else if (auth.role === "ROLE_SELLER") {
                    navigate("/seller");
                } else if (auth.role === "ROLE_CUSTOMER") {
                    navigate(from || "/");
                } else {
                    navigate("/");
                }

            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [auth.jwt, auth.role]);

    React.useEffect(() => {
        if (auth.message) {
            setOpen(true);
        }
    }, [auth.message]);

    React.useEffect(() => {
        console.log("AUTH MESSAGE ", auth.message);
    }, [auth.message]);


    React.useEffect(() => {
        console.log("AUTH STATE ", auth);
        console.log("AUTH USER ", auth.user);
    }, [auth]);


    return (
        <div>
            <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Login</h1>
            <h1>
                <div className='space-y-5'>
                    <TextField
                        fullWidth
                        name='email'
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors?.email)}
                        helperText={formik.touched?.email && formik.errors?.email}
                    />

                    {auth.otpSent &&
                        <div className='space-y-2'>
                            <p className='font-medium text-sm opacity-60'>Enter OTP sent to your Email</p>
                            <TextField
                                fullWidth
                                name='otp'
                                label="Otp"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.otp && Boolean(formik.errors?.otp)}
                                helperText={formik.touched?.otp && formik.errors?.otp}
                            />
                        </div>
                    }


                    {auth.otpSent ? (
                        <Button
                            type="submit"
                            onClick={() => formik.handleSubmit()}
                            fullWidth
                            variant="contained"
                            sx={{ py: "11px" }}
                        >
                            {auth.loading ? <CircularProgress /> : "Login"}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleSendOtp}
                            fullWidth
                            variant="contained"
                            sx={{ py: "11px" }}
                        >
                            {auth.loading ? <CircularProgress /> : "Send OTP"}
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
            </h1 >
        </div >
    )
}

export default LoginForm