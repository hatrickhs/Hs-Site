
import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { AddPhotoAlternate, Close } from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { uploadToCloudinary } from "../../../Util/uploadToCloudinary";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { createProduct, clearMessage } from "../../../State/seller/sellerProductSlice";


// Main category
import { mainCategory } from "../../../data/category/mainCategory";

// Level 2
import { menLevelTwo } from "../../../data/category/LevelTwo/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/LevelTwo/womenLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/LevelTwo/furnitureLevelTwo";
import { electronicsLevelTwo } from "../../../data/category/LevelTwo/electronicsLevelTwo";

// Level 3
import { menLevelThree } from "../../../data/category/LevelThree/menLevelThree";
import { womenLevelThree } from "../../../data/category/LevelThree/womenLevelThree";
import { furnitureLevelThree } from "../../../data/category/LevelThree/furnitureLevelThree";
import { electronicsLevelThree } from "../../../data/category/LevelThree/electronicsLevelThree";

const AddProduct = () => {
  const dispatch = useAppDispatch();

  const [uploadImage, setUploadImage] = useState(false);
  const [levelTwoOptions, setLevelTwoOptions] = useState<any[]>([]);
  const [levelThreeOptions, setLevelThreeOptions] = useState<any[]>([]);
  const { success, error, loading } = useAppSelector(state => state.sellerProduct);
  const [formError, setFormError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    mrpPrice: Yup.number()
      .required("MRP Price is required")
      .positive("MRP must be positive"),
    sellingPrice: Yup.number()
      .required("Selling Price is required")
      .positive("Selling price must be positive"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1"),
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: "",
      color: "",
      sizes: "",
      category: "",
      category2: "",
      category3: "",
      images: [] as string[],


    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createProduct({
        request: values,
        jwt: localStorage.getItem("jwt"),
      }));
    },
  });

  /* CATEGORY LOGIC */

  // Main → Level 2
  useEffect(() => {
    let options: any[] = [];

    switch (formik.values.category) {
      case "Men":
        options = menLevelTwo;
        break;
      case "Women":
        options = womenLevelTwo;
        break;
      case "Home & Furniture":
        options = furnitureLevelTwo;
        break;
      case "Electronics":
        options = electronicsLevelTwo;
        break;
      default:
        options = [];
    }

    setLevelTwoOptions(options);
    formik.setFieldValue("category2", "");
    formik.setFieldValue("category3", "");
    setLevelThreeOptions([]);
  }, [formik.values.category]);

  // Level 2 → Level 3
  useEffect(() => {
    let options: any[] = [];

    if (formik.values.category2) {
      switch (formik.values.category) {
        case "Men":
          options = menLevelThree.filter(
            item => item.parentCategoryId === formik.values.category2
          );
          break;
        case "Women":
          options = womenLevelThree.filter(
            item => item.parentCategoryId === formik.values.category2
          );
          break;
        case "Home & Furniture":
          options = furnitureLevelThree.filter(
            item => item.parentCategoryId === formik.values.category2
          );
          break;
        case "Electronics":
          options = electronicsLevelThree.filter(
            item => item.parentCategoryId === formik.values.category2
          );
          break;
      }
    }

    setLevelThreeOptions(options);
    formik.setFieldValue("category3", "");
  }, [formik.values.category2]);

  /* IMAGE UPLOAD */

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadImage(true);
    const imageUrl = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, imageUrl]);
    setUploadImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="p-6">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>

          {/* IMAGE UPLOAD */}
          <Grid item xs={12} sm={3}>
            <input type="file" hidden id="fileInput" onChange={handleImageChange} />
            <label htmlFor="fileInput">
              <div className="w-24 h-24 border rounded flex items-center justify-center cursor-pointer">
                <AddPhotoAlternate />
                {uploadImage && <CircularProgress size={24} />}
              </div>
            </label>

            <div className="flex gap-2 mt-2">
              {formik.values.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-20 h-20 object-cover rounded" />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveImage(i)}
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          {/* PRODUCT DETAILS */}
          <Grid item xs={12} sm={9}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Product Title" {...formik.getFieldProps("title")} />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="MRP Price" type="number" {...formik.getFieldProps("mrpPrice")} />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Selling Price" type="number" {...formik.getFieldProps("sellingPrice")} />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Quantity" type="number" {...formik.getFieldProps("quantity")} />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Color" {...formik.getFieldProps("color")} />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Sizes" {...formik.getFieldProps("sizes")} />
              </Grid>

              {/* MAIN CATEGORY */}
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Main Category</InputLabel>
                  <Select {...formik.getFieldProps("category")} label="Main Category">
                    {mainCategory.map((item: any) => (
                      <MenuItem key={item.categoryId} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* LEVEL 2 */}
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  fullWidth
                  label="Sub Category"
                  {...formik.getFieldProps("category2")}
                  disabled={!levelTwoOptions.length}
                >
                  {levelTwoOptions.map(item => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* LEVEL 3 */}
              {levelThreeOptions.length > 0 && (
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    fullWidth
                    label="Sub Sub Category"
                    {...formik.getFieldProps("category3")}
                  >
                    {levelThreeOptions.map(item => (
                      <MenuItem key={item.categoryId} value={item.categoryId}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  {...formik.getFieldProps("description")}
                />
              </Grid>

            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "ADD PRODUCT"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={Boolean(success || error)}
        autoHideDuration={3000}
      >
        <Alert
          severity={success ? "success" : "error"}
        >
          {success || error}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default AddProduct;


