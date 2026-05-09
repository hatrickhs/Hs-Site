
// // import React, { useEffect } from "react";
// // import {
// //   Box,
// //   Button,
// //   FormControl,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   TextField,
// //   Typography,
// //   Paper
// // } from "@mui/material";
// // import { useFormik } from "formik";
// // import { useAppDispatch, useAppSelector } from "../../../State/Store";
// // import { createDeal } from "../../../State/admin/DealSlice";
// // import { fetchHomepageData } from "../../../State/customer/customerSlice";

// // const CreateDealForm = () => {
// //   const dispatch = useAppDispatch();
// //   const categories = useAppSelector((state) => state.admin.categories);

// //   useEffect(() => {
// //     dispatch(fetchHomepageData());
// //   }, [dispatch]);

// //   const formik = useFormik({
// //     initialValues: {
// //       discount: 0,
// //       category: "",
// //       image: "",
// //       name: "",
// //       sellingPrice: 0,
// //       mrpPrice: 0,
// //     },
// //     onSubmit: (values, { resetForm }) => {
// //       const reqData = {
// //         discount: Number(values.discount),
// //         image: values.image || null,
// //         name: values.name || null,
// //         sellingPrice: Number(values.sellingPrice),
// //         mrpPrice: Number(values.mrpPrice),
// //         category: {
// //           id: Number(values.category),
// //         },
// //       };

// //       console.log("SUBMIT CLICKED");
// //       console.log(reqData);

// //       dispatch(createDeal(reqData as any));
// //       resetForm();
// //     },
// //   });

// //   return (
// //     <Box
// //       sx={{
// //         height: "100vh",
// //         width: "100vw",
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         background: "#f5f5f5",
// //       }}
// //     >
// //       <Paper
// //         elevation={4}
// //         sx={{
// //           p: 4,
// //           width: "100%",
// //           maxWidth: 450,

// //           maxHeight: "70vh",      // ✅ IMPORTANT
// //           overflowY: "auto",      // ✅ scroll INSIDE paper

// //           borderRadius: 3,
// //         }}
// //       >
// //         <Typography variant="h5" textAlign="center" mb={2}>
// //           Create Deal
// //         </Typography>

// //         <Box
// //           component="form"
// //           onSubmit={formik.handleSubmit}
// //           display="flex"
// //           flexDirection="column"
// //           gap={2}
// //         >
// //           <TextField
// //             name="name"
// //             label="Deal Name"
// //             value={formik.values.name}
// //             onChange={formik.handleChange}
// //             fullWidth
// //           />

// //           <TextField
// //             name="discount"
// //             label="Discount (%)"
// //             type="number"
// //             value={formik.values.discount}
// //             onChange={formik.handleChange}
// //             fullWidth
// //           />

// //           <TextField
// //             name="image"
// //             label="Image URL"
// //             value={formik.values.image}
// //             onChange={formik.handleChange}
// //             fullWidth
// //           />

// //           <TextField
// //             name="mrpPrice"
// //             label="MRP Price"
// //             type="number"
// //             value={formik.values.mrpPrice}
// //             onChange={formik.handleChange}
// //             fullWidth
// //           />

// //           <FormControl fullWidth>
// //             <InputLabel>Category</InputLabel>
// //             <Select
// //               name="category"
// //               value={formik.values.category}
// //               label="Category"
// //               onChange={formik.handleChange}
// //             >
// //               {categories
// //                 ?.filter((item: any) => item.section === "DEALS")
// //                 .map((item: any) => (
// //                   <MenuItem key={item.id} value={item.id}>
// //                     {item.name}
// //                   </MenuItem>
// //                 ))}
// //             </Select>
// //           </FormControl>

// //           <Button type="submit" variant="contained">
// //             Create Deal
// //           </Button>
// //         </Box>
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default CreateDealForm;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   Paper,
//   Checkbox,
//   FormControlLabel
// } from "@mui/material";
// import { useFormik } from "formik";
// import { useAppDispatch, useAppSelector } from "../../../State/Store";
// import { createDeal } from "../../../State/admin/DealSlice";
// import { fetchHomepageData } from "../../../State/customer/customerSlice";

// const CreateDealForm = () => {
//   const dispatch = useAppDispatch();
//   const categories = useAppSelector((state) => state.admin.categories);

//   const [hasTimer, setHasTimer] = useState(false);

//   useEffect(() => {
//     dispatch(fetchHomepageData());
//   }, [dispatch]);

//   const formik = useFormik({
//     initialValues: {
//       discount: 0,
//       category: "",
//       image: "",
//       name: "",
//       sellingPrice: 0,
//       mrpPrice: 0,
//       expiryTime: ""
//     },
//     onSubmit: (values, { resetForm }) => {
//       const reqData = {
//         discount: Number(values.discount),
//         image: values.image || null,
//         name: values.name || null,
//         sellingPrice: Number(values.sellingPrice),
//         mrpPrice: Number(values.mrpPrice),

//         // 🔥 TIMER LOGIC
//         expiryTime: hasTimer ? values.expiryTime : null,

//         category: {
//           id: Number(values.category),
//         },
//       };

//       dispatch(createDeal(reqData as any));
//       resetForm();
//       setHasTimer(false);
//     },
//   });

//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         width: "100vw",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#f5f5f5",
//       }}
//     >
//       <Paper
//         elevation={4}
//         sx={{
//           p: 4,
//           width: "100%",
//           maxWidth: 450,
//           maxHeight: "75vh",
//           overflowY: "auto",
//           borderRadius: 3,
//         }}
//       >
//         <Typography variant="h5" textAlign="center" mb={2}>
//           Create Deal
//         </Typography>

//         <Box
//           component="form"
//           onSubmit={formik.handleSubmit}
//           display="flex"
//           flexDirection="column"
//           gap={2}
//         >
//           <TextField
//             name="name"
//             label="Deal Name"
//             value={formik.values.name}
//             onChange={formik.handleChange}
//           />

//           <TextField
//             name="discount"
//             label="Discount (%)"
//             type="number"
//             value={formik.values.discount}
//             onChange={formik.handleChange}
//           />

//           <TextField
//             name="image"
//             label="Image URL"
//             value={formik.values.image}
//             onChange={formik.handleChange}
//           />

//           <TextField
//             name="mrpPrice"
//             label="MRP Price"
//             type="number"
//             value={formik.values.mrpPrice}
//             onChange={formik.handleChange}
//           />

//           {/* 🔥 TIMER TOGGLE */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={hasTimer}
//                 onChange={(e) => setHasTimer(e.target.checked)}
//               />
//             }
//             label="Set Timer (Optional)"
//           />

//           {/* 🔥 ONLY IF TIMER ON */}
//           {hasTimer && (
//             <TextField
//               name="expiryTime"
//               label="Expiry Time"
//               type="datetime-local"
//               InputLabelProps={{ shrink: true }}
//               value={formik.values.expiryTime}
//               onChange={formik.handleChange}
//             />
//           )}

//           <FormControl fullWidth>
//             <InputLabel>Category</InputLabel>
//             <Select
//               name="category"
//               value={formik.values.category}
//               label="Category"
//               onChange={formik.handleChange}
//             >
//               {categories
//                 ?.filter((item: any) => item.section === "DEALS")
//                 .map((item: any) => (
//                   <MenuItem key={item.id} value={item.id}>
//                     {item.name}
//                   </MenuItem>
//                 ))}
//             </Select>
//           </FormControl>

//           <Button type="submit" variant="contained">
//             Create Deal
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default CreateDealForm;

import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { useFormik } from "formik";

import { useAppDispatch, useAppSelector } from "../../../State/Store";

import { createDeal } from "../../../State/admin/DealSlice";
import { fetchHomepageData } from "../../../State/customer/customerSlice";
import { uploadToCloudinary } from "../../../Util/uploadToCloudinary";


const CreateDealForm = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(
    (state) => state.admin.categories
  );

  const [hasTimer, setHasTimer] = useState(false);

  // 🔥 multiple images
  const [images, setImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchHomepageData());
  }, [dispatch]);

  // 🔥 upload image
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files) return;

    const uploadedImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await uploadToCloudinary(files[i]);

      if (url) {
        uploadedImages.push(url);
      }
    }

    setImages((prev) => [...prev, ...uploadedImages]);
  };

  // 🔥 remove image
  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);

    setImages(updated);
  };

  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: "",
      name: "",
      sellingPrice: 0,
      mrpPrice: 0,
      expiryTime: "",
    },

    onSubmit: (values, { resetForm }) => {
      const reqData = {
        images,

        discount: Number(values.discount),

        name: values.name || null,

        sellingPrice: Number(values.sellingPrice),

        mrpPrice: Number(values.mrpPrice),

        expiryTime: hasTimer
          ? values.expiryTime
          : null,

        category: {
          id: Number(values.category),
        },
      };

      dispatch(createDeal(reqData as any));

      resetForm();

      setImages([]);

      setHasTimer(false);
    },
  });

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 450,
          maxHeight: "75vh",
          overflowY: "auto",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          mb={2}
        >
          Create Deal
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          {/* 🔥 FILE INPUT */}
          <input
            type="file"
            hidden
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          {/* 🔥 ADD IMAGE BOX */}
          <Box
            onClick={() =>
              fileInputRef.current?.click()
            }
            sx={{
              width: 120,
              height: 120,
              border: "2px dashed gray",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              cursor: "pointer",
            }}
          >
            <AddIcon sx={{ fontSize: 40 }} />
          </Box>

          {/* 🔥 PREVIEW IMAGES */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                }}
              >
                <img
                  src={img}
                  alt=""
                  width={100}
                  height={100}
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />

                {/* 🔥 DELETE ICON */}
                <IconButton
                  size="small"
                  onClick={() =>
                    handleRemoveImage(index)
                  }
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "white",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>

          <TextField
            name="name"
            label="Deal Name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />

          <TextField
            name="discount"
            label="Discount (%)"
            type="number"
            value={formik.values.discount}
            onChange={formik.handleChange}
          />

          <TextField
            name="mrpPrice"
            label="MRP Price"
            type="number"
            value={formik.values.mrpPrice}
            onChange={formik.handleChange}
          />

          {/* 🔥 TIMER */}
          <FormControlLabel
            control={
              <Checkbox
                checked={hasTimer}
                onChange={(e) =>
                  setHasTimer(
                    e.target.checked
                  )
                }
              />
            }
            label="Set Timer (Optional)"
          />

          {hasTimer && (
            <TextField
              name="expiryTime"
              label="Expiry Time"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.expiryTime}
              onChange={formik.handleChange}
            />
          )}

          {/* 🔥 CATEGORY */}
          <FormControl fullWidth>
            <InputLabel>
              Category
            </InputLabel>

            <Select
              name="category"
              value={formik.values.category}
              label="Category"
              onChange={formik.handleChange}
            >
              {categories
                ?.filter(
                  (item: any) =>
                    item.section === "DEALS"
                )
                .map((item: any) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
          >
            Create Deal
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateDealForm;