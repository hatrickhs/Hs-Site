import React from 'react'
import { useAppDispatch } from '../../../State/Store'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { sendLoginSignupOtp, signup } from '../../../State/seller/AuthSlice'
import { Button, TextField } from '@mui/material'

const RegisterForm = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [otpLoading, setOtpLoading] = React.useState(false)

    const formik = useFormik({
        initialValues: {
            email: "",
            otp: "",
            fullName: ""
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.email) errors.email = "Email required";
            if (!values.otp) errors.otp = "OTP required";
            if (!values.fullName) errors.fullName = "Name required";

            return errors;
        },
        onSubmit: async (values) => {
            console.log("Form Values:", values);

            const signupData = {
                email: values.email,
                otp: values.otp,
                fullName: values.fullName
            };

            const response: any = await dispatch(signup(signupData));

            if (response?.payload) {
                navigate("/"); // success – go home
            }
        }
    });

    const handleSendOtp = async () => {
        setOtpLoading(true);
        await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
        setOtpLoading(false);
    };

    return (
        <div>
            <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Signup</h1>

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

                {formik.values.email && (
                    <div className='space-y-5'>
                        <div className='space-y-2'>
                            <p className='font-medium text-sm opacity-60'>Enter OTP sent to your Email</p>

                            <TextField
                                fullWidth
                                name='otp'
                                label="OTP"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.otp && Boolean(formik.errors?.otp)}
                                helperText={formik.touched?.otp && formik.errors?.otp}
                            />
                        </div>

                        <TextField
                            fullWidth
                            name='fullName'
                            label="Full Name"
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullName && Boolean(formik.errors?.fullName)}
                            helperText={formik.touched?.fullName && formik.errors?.fullName}
                        />
                    </div>
                )}

                <Button
                    type="button"
                    onClick={handleSendOtp}
                    fullWidth
                    variant='contained'
                    disabled={otpLoading}
                    sx={{ py: "11px" }}
                >
                    {otpLoading ? "Sending..." : "Send OTP"}
                </Button>

                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                    fullWidth
                    variant='contained'
                    sx={{ py: "11px" }}
                >
                    Signup
                </Button>
            </div>
        </div>
    )
}

export default RegisterForm
