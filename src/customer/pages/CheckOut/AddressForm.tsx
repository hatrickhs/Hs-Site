
import { Box, TextField, Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import axios from "axios";

interface AddressFormProps {
  onSave: (savedAddress: any) => void;
}

const AddressFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid mobile number"),
  pinCode: Yup.string()
    .required("Pin Code is required")
    .matches(/^[1-9][0-9]{5}$/, "Invalid pin code"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  locality: Yup.string().required("Locality is required"),
});

const AddressForm: React.FC<AddressFormProps> = ({ onSave }) => {
  const token = localStorage.getItem("jwt") || "";

  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      pinCode: "",
      address: "",
      city: "",
      state: "",
      locality: "",
    },
    validationSchema: AddressFormSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/addresses/add",
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const savedAddress = response.data; 

        onSave(savedAddress);
      } catch (err) {
        console.error("Address save failed:", err);
        alert("Address save failed.");
      }
    },
  });

  return (
    <Box>
      <p className="text-xl font-bold text-center pb-5">Contact Details</p>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {["name","mobile","pinCode","address","locality","city","state"].map(
            (field) => (
              <Grid
                item
                xs={field === "mobile" || field === "pinCode" ? 6 : 12}
                key={field}
              >
                <TextField
                  fullWidth
                  name={field}
                  label={field.toUpperCase()}
                  value={(formik.values as any)[field]}
                  onChange={formik.handleChange}
                  error={
                    (formik.touched as any)[field] &&
                    Boolean((formik.errors as any)[field])
                  }
                  helperText={
                    (formik.touched as any)[field] &&
                    (formik.errors as any)[field]
                  }
                />
              </Grid>
            )
          )}
          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained">
              Save Address
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;
