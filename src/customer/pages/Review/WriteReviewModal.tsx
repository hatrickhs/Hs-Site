
// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Rating,
//   Button,
//   Stack,
//   IconButton,
//   CircularProgress,
//   Modal,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAppDispatch } from "../../../State/Store";
// import { fetchProductById } from "../../../State/customer/ProductSlice";
// import { fetchDealById } from "../../../State/admin/DealSlice";

// // Cloudinary Upload
// export const uploadToCloudinary = async (file: File): Promise<string | undefined> => {
//   const cloud_name = "djv556vfm";
//   const upload_preset = "Hatrik";

//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", upload_preset);

//   try {
//     const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
//       method: "POST",
//       body: formData,
//     });
//     const data = await res.json();
//     return data.secure_url;
//   } catch (err) {
//     console.error("Upload error:", err);
//   }
// };

// interface WriteReviewModalProps {
//   open?: boolean;
//   onClose?: () => void;
//   productId?: number;
//   dealId?: number;
//   onReviewSubmit?: () => void;
// }

// const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
//   open,
//   onClose,
//   productId: propProductId,
//   dealId: propDealId,
//   onReviewSubmit,
// }) => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const params = useParams();

//   const isPageMode = open === undefined;

//   const productId =
//     propProductId ?? (params.productId ? Number(params.productId) : undefined);

//   const dealId =
//     propDealId ?? (params.dealId ? Number(params.dealId) : undefined);

//   const [rating, setRating] = useState<number | null>(5);
//   const [comment, setComment] = useState("");
//   const [images, setImages] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const formData = new FormData();

//   const jwt = localStorage.getItem("jwt");

//   const handleClose = () => {
//     if (onClose) onClose();
//     else navigate(-1);
//   };

//   formData.append(
//     "review",
//     new Blob(
//       [
//         JSON.stringify({
//           reviewText: comment,
//           reviewRating: rating,
//         }),
//       ],
//       { type: "application/json" }
//     )
//   );

//   // Upload Image
//   const handleUpload = async (file: File) => {
//     setUploading(true);
//     const url = await uploadToCloudinary(file);
//     if (url) setImages((prev) => [...prev, url]);
//     setUploading(false);
//   };

//   const handleRemoveImage = (idx: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== idx));
//   };

//   //  SUBMIT REVIEW
//   const handleSubmit = async () => {
//     console.log("JWT ", jwt);
//     console.log("PRODUCT ID ", productId);
//     console.log("DEAL ID ", dealId);

//     if (!jwt) return alert("Login required");
//     if (!comment.trim() || !rating) return alert("Fill all fields");
//     if (!productId && !dealId) return alert("Missing product or deal ID");

//     setLoading(true);

//     try {
//       // FIX: Smart token handling
//       const token = jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;

//       const url = dealId
//         ? `https://hs-site-1.onrender.com/api/deals/${dealId}/reviews`
//         : `https://hs-site-1.onrender.com/api/products/${productId}/reviews`;

//       await axios.post(
//         url,
//         {
//           reviewText: comment,
//           reviewRating: rating,
//           productImages: images,
//         },
//         {
//           headers: { Authorization: token },
//         }
//       );

//       alert("Review submitted successfully 🎉");

//       // Refresh UI
//       if (onReviewSubmit) onReviewSubmit();
//       if (productId) dispatch(fetchProductById(productId.toString()));
//       if (dealId) dispatch(fetchDealById(dealId.toString()));

//       // Reset
//       setComment("");
//       setRating(5);
//       setImages([]);

//       handleClose();
//     } catch (err: any) {
//       console.error("FULL ERROR ", err);
//       console.error("BACKEND ERROR ", err.response?.data);

//       alert(err.response?.data?.message || "Failed to submit review");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const content = (
//     <Box maxWidth={800} mx="auto" py={4}>
//       <Typography variant="h5" mb={3}>
//         Write a Review
//       </Typography>

//       <Box display="flex" gap={4} flexWrap="wrap">
//         {/* Image Upload */}
//         <Box>
//           <Typography mb={1}>Product Images</Typography>
//           <Box
//             sx={{
//               width: 120,
//               height: 120,
//               border: "2px dashed gray",
//               borderRadius: 2,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//             onClick={() => document.getElementById("file-input")?.click()}
//           >
//             {uploading ? <CircularProgress size={24} /> : "+"}
//             {/* <input
//               id="file-input"
//               type="file"
//               hidden
//               onChange={(e) => {
//                 if (e.target.files) handleUpload(e.target.files[0]);
//               }}
//             /> */}
//             <input
//               id="file-input"
//               type="file"
//               hidden
//               multiple
//               onChange={async (e) => {
//                 if (e.target.files) {

//                   const files = Array.from(e.target.files);

//                   for (const file of files) {
//                     await handleUpload(file);
//                   }
//                 }
//               }}
//             />
//           </Box>

//           <Stack direction="row" spacing={2} mt={2}>
//             {images.map((img, idx) => (
//               <Box key={idx} position="relative">
//                 <img src={img} width={80} height={80} style={{ borderRadius: 8 }} />
//                 <IconButton
//                   size="small"
//                   onClick={() => handleRemoveImage(idx)}
//                   sx={{
//                     position: "absolute",
//                     top: -8,
//                     right: -8,
//                     bgcolor: "white",
//                   }}
//                 >
//                   <CloseIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             ))}
//           </Stack>
//         </Box>

//         {/* Review Form */}
//         <Box flex={1}>
//           <Typography mb={1}>Your Rating</Typography>
//           <Rating
//             value={rating}
//             onChange={(e, val) => setRating(val)}
//             precision={0.5}
//           />

//           <TextField
//             label="Your Review"
//             fullWidth
//             multiline
//             minRows={4}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             margin="normal"
//           />

//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit Review"}
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );

//   if (isPageMode) {
//     return <Box sx={{ p: 3 }}>{content}</Box>;
//   }

//   return (
//     <Modal open={open!} onClose={handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 700,
//           bgcolor: "background.paper",
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//           maxHeight: "90vh",
//           overflow: "auto",
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between" mb={2}>
//           <Typography variant="h6">Write a Review</Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Stack>

//         {content}
//       </Box>
//     </Modal>
//   );
// };

// export default WriteReviewModal;

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Rating,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch } from "../../../State/Store";
import { fetchProductById } from "../../../State/customer/ProductSlice";
import { fetchDealById } from "../../../State/admin/DealSlice";

export const uploadToCloudinary = async (file: File) => {
  const cloud_name = "djv556vfm";
  const upload_preset = "Hatrik";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

const WriteReviewModal = ({
  open,
  onClose,
  productId: propProductId,
  dealId: propDealId,
  onReviewSubmit,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();

  const jwt = localStorage.getItem("jwt");

  const productId =
    propProductId ?? (params.productId ? Number(params.productId) : undefined);

  const dealId =
    propDealId ?? (params.dealId ? Number(params.dealId) : undefined);

  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const url = await uploadToCloudinary(file);
    if (url) setImages((prev) => [...prev, url]);
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!jwt) return alert("Login required");
    if (!comment.trim() || !rating) return alert("Fill all fields");

    setLoading(true);

    try {
      const token = jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;

      const url = dealId
        ? `https://hs-site-1.onrender.com/api/deals/${dealId}/reviews`
        : `https://hs-site-1.onrender.com/api/products/${productId}/reviews`;

      const formData = new FormData();

      formData.append(
        "review",
        new Blob(
          [
            JSON.stringify({
              reviewText: comment,
              reviewRating: rating,
              productImages: images,
            }),
          ],
          { type: "application/json" }
        )
      );

      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(url, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Review submitted successfully");

      if (productId) dispatch(fetchProductById(productId.toString()));
      if (dealId) dispatch(fetchDealById(dealId.toString()));

      setComment("");
      setRating(5);
      setImages([]);

      handleClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <Box maxWidth={800} mx="auto" py={4}>
      <Typography variant="h5">Write Review</Typography>

      <Box display="flex" gap={4} mt={3} flexWrap="wrap">
        <Box>
          <Typography>Images</Typography>

          <Box
            sx={{
              width: 120,
              height: 120,
              border: "2px dashed gray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("file")?.click()}
          >
            {uploading ? <CircularProgress /> : "+"}

            <input
              id="file"
              type="file"
              hidden
              multiple
              onChange={async (e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  for (const file of files) {
                    await handleUpload(file);
                  }
                }
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} mt={2}>
            {images.map((img, i) => (
              <Box key={i} position="relative">
                <img src={img} width={70} height={70} />
              </Box>
            ))}
          </Stack>
        </Box>

        <Box flex={1}>
          <Rating value={rating} onChange={(e, v) => setRating(v)} />

          <TextField
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  if (!open) return <Box p={3}>{content}</Box>;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          bgcolor: "white",
          p: 3,
        }}
      >
        {content}
      </Box>
    </Modal>
  );
};

export default WriteReviewModal;