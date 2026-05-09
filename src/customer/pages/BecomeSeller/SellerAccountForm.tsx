import { Button, Step, StepLabel, Stepper } from '@mui/material';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import BecomeSellerFormStep1 from './BecomeSellerFormStep1';
import BecomeSellerFormStep2 from './BecomeSellerFormStep2';
import BecomeSellerFormStep3 from './BecomeSellerFormStep3';
import BecomeSellerFormStep4 from './BecomeSellerFormStep4';
import { api } from '../../../config/Api';


const steps = [
  "Tax Details & Mobile",
  "Pickup Address",
  "Bank Details",
  "Supplier Details",
];

const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
      gstin: "",
      pickupAddress: {
        name: "",
        mobile: "",
        pincode: "",
        address: "",
        locality: "",
        city: "",
        state: "",
      },
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      },
      sellName: "",
      email: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        logo: "",
        banner: "",
        businessAddress: ""
      },
      password: ""
    },
    onSubmit: (values) => {
      // Last step submit handled separately
      console.log("Formik submitted values:", values);
    }
  });

  // Next step / Submit
  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      // Last step → create account
      await handleCreateAccount();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  // API call to create seller account
  const handleCreateAccount = async () => {
    try {
      const jwt = localStorage.getItem("jwt") || "";
      const response = await api.post("/sellers", formik.values, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Seller account created successfully:", response.data);
      // Optionally: navigate to seller dashboard
      // navigate("/seller");
    } catch (error: any) {
      console.error("Error creating seller account:", error.response || error.message);
    }
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <section className='mt-10 space-y-10'>
        <div>
          {activeStep === 0 ? <BecomeSellerFormStep1 formik={formik} /> :
           activeStep === 1 ? <BecomeSellerFormStep2 formik={formik} /> :
           activeStep === 2 ? <BecomeSellerFormStep3 formik={formik} /> :
           <BecomeSellerFormStep4 formik={formik} />}
        </div>

        <div className='flex items-center justify-between mt-6'>
          <Button onClick={handleBack} variant="contained" disabled={activeStep === 0}>
            Back
          </Button>

          <Button onClick={handleNext} variant="contained">
            {activeStep === steps.length - 1 ? "Create Account" : "Continue"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SellerAccountForm;
