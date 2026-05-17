
import React from "react";
import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../State/Store";
import {
  removeDealFromWishlist,
  removeProductFromWishlist,
} from "../../State/customer/WishlistSlice";
import { teal } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

type Props = {
  item: any;
  type: "PRODUCT" | "DEAL";
};

const WishlistProductCard = ({ item, type }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // REMOVE
  const handleRemove = () => {
    if (!item?.id) return;

    if (type === "DEAL") {
      dispatch(removeDealFromWishlist({ dealId: item.id }));
    } else {
      dispatch(removeProductFromWishlist({ productId: item.id }));
    }
  };

  // OPEN DETAILS PAGE
  const handleOpen = () => {
    if (type === "PRODUCT") {
      navigate(`/product/${item.id}`, {
        state: { product: item },
      });
    } else {
      navigate(`/deal-details/${item.id}`, {
        state: { deal: item },
      });
    }
  };

  // SAFE IMAGE FIX
  const image = item?.images?.[0] || item?.image;

  // SAFE TITLE
  const title = item?.title || item?.name;

  return (
    <div className="w-64 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">

      {/* IMAGE */}
      <div
        className="w-full h-64 relative cursor-pointer"
        onClick={handleOpen}
      >
        <img
          src={image}
          className="w-full h-full object-cover rounded-t-xl"
          alt={title}
        />

        {/* DELETE BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="absolute top-2 right-2 bg-white rounded-full shadow p-1"
        >
          <Close sx={{ color: teal[500], fontSize: "1.5rem" }} />
        </button>
      </div>

      {/* DETAILS */}
      <div className="p-3 space-y-2 cursor-pointer" onClick={handleOpen}>
        <p className="text-gray-800 font-medium truncate">
          {title}
        </p>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-gray-900">
            ₹ {item.sellingPrice}
          </span>

          <span className="line-through text-gray-400">
            ₹ {item.mrpPrice}
          </span>

          <span className="text-green-600 font-semibold">
            {item.discountPercentage}% off
          </span>
        </div>
      </div>
    </div>
  );
};

export default WishlistProductCard;