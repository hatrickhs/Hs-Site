
import React from 'react';
import { useFormik } from 'formik';
import { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, TextField, Grid } from '@mui/material';
import axios from 'axios';

interface CouponFormValues {
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
}

const AddNewCouponForm = () => {
  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: '',
      discountPercentage: 0,
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: 0,
    },
    onSubmit: async (values) => {
     
      const formattedValues = {
        ...values,
        validityStartDate: values.validityStartDate
          ? values.validityStartDate.toISOString().split('T')[0]
          : null,
        validityEndDate: values.validityEndDate
          ? values.validityEndDate.toISOString().split('T')[0]
          : null,
      };

      try {
        const response = await axios.post(
          'https://hs-site-1.onrender.com/api/coupons',
          formattedValues,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Coupon added successfully', response.data);
        alert('Coupon added successfully!');
        formik.resetForm();
      } catch (error) {
        console.error('Error adding coupon', error);
        alert('Failed to add coupon. Check console for details.');
      }
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-color pb-5 text-center">
        Create New Coupon
      </h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Coupon Code */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="code"
                label="Coupon Code"
                value={formik.values.code}
                onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
              />
            </Grid>

            {/* Discount Percentage */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="discountPercentage"
                label="Discount Percentage"
                type="number"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
                error={
                  formik.touched.discountPercentage &&
                  Boolean(formik.errors.discountPercentage)
                }
                helperText={
                  formik.touched.discountPercentage &&
                  formik.errors.discountPercentage
                }
              />
            </Grid>

            {/* Validity Start Date */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Validity Start Date"
                value={formik.values.validityStartDate as Dayjs | null}
                onChange={(date) =>
                  formik.setFieldValue('validityStartDate', date)
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>

            {/* Validity End Date */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Validity End Date"
                value={formik.values.validityEndDate as Dayjs | null}
                onChange={(date) =>
                  formik.setFieldValue('validityEndDate', date)
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>

            {/* Minimum Order Value */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="minimumOrderValue"
                label="Minimum Order Value"
                type="number"
                value={formik.values.minimumOrderValue}
                onChange={formik.handleChange}
                error={
                  formik.touched.minimumOrderValue &&
                  Boolean(formik.errors.minimumOrderValue)
                }
                helperText={
                  formik.touched.minimumOrderValue &&
                  formik.errors.minimumOrderValue
                }
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: '.8rem' }}
              >
                CREATE COUPON
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default AddNewCouponForm;
