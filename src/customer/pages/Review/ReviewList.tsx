import { Box } from "@mui/material";

interface Review {
  id: number;
  user?: { name?: string };
  comment: string;
  rating: number;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <Box className="mt-5 border p-5">
      <h2 className="text-lg font-bold mb-2">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev.id} className="border-b py-2">
            <p className="font-medium">{rev.user?.name || "Anonymous"}</p>
            <p className="text-sm text-gray-600">{rev.comment}</p>
            <p className="text-xs text-gray-500">Rating: {rev.rating}/5</p>
          </div>
        ))
      )}
    </Box>
  );
};

export default ReviewList;
