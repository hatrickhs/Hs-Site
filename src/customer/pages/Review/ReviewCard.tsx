
import React from "react";
import { Avatar, IconButton, Rating, Grid } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { red } from "@mui/material/colors";

interface ReviewCardProps {
  reviewId: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatarLetter?: string;
  images?: string[];
  onDeleted?: () => void;
}

const ReviewCard = ({
  reviewId,
  name,
  date,
  rating,
  comment,
  avatarLetter,
  images,
  onDeleted
}: ReviewCardProps) => {

  const handleDelete = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    try {
      const response = await fetch(`https://hs-site-1.onrender.com/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

      // Delete successful, UI update
      if (onDeleted) onDeleted();

      console.log(`Review ${reviewId} deleted successfully`);
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  return (
    <div className="flex justify-between items-start border p-2 rounded shadow-sm bg-white">
      <Grid container spacing={2} alignItems="flex-start">
        {/* Avatar */}
        <Grid item xs={2} sm={1} className="flex justify-center">
          <Avatar sx={{ bgcolor: "#9155FD", width: 56, height: 56, fontSize: 20 }}>
            {avatarLetter || name.charAt(0)}
          </Avatar>
        </Grid>

        {/* Review Content */}
        <Grid item xs={8} sm={10}>
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-base">{name || "HS"}</p>
              <p className="text-xs text-gray-500">{date || "12:04:4040"}</p>
            </div>

            <Rating value={rating} readOnly precision={0.5} className="mt-1" />
            <p className="mt-1 text-sm text-gray-700">{comment || "abcd"}</p>

            {/* {imageUrl && (
              <img
                src={imageUrl}
                className="w-20 h-20 mt-2 object-cover rounded"
                alt="review"
              />
            )}
          </div> */}
            {images && images.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-20 h-20 object-cover rounded"
                    alt={`review-${index}`}
                  />
                ))}
              </div>
            )}
            </div>
        </Grid>

        {/* Delete Button */}
        <Grid item xs={2} sm={1} className="flex justify-end">
          <IconButton onClick={handleDelete}>
            <Delete sx={{ color: red[600] }} />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReviewCard;
