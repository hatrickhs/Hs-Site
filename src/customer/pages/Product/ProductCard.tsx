
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Favorite, ModeComment } from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import { Product } from "../../../State/types/ProductType";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../State/Store";
import { addProductToWishlist } from "../../../State/customer/WishlistSlice";

const ProductCard = ({ item }: { item: Product }) => {

  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isDeal = window.location.href.includes("section=DEALS");
  const isProduct = !isDeal;

  // IMAGE SLIDER
  useEffect(() => {
    let interval: any;

    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImage(
          (prev) => (prev + 1) % (item.images?.length || 1)
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isHovered, item.images?.length]);

  // WISHLIST HANDLER
  const handleWishlist = (event: any) => {
    event.stopPropagation();

    const token = localStorage.getItem("jwt");

    if (!token) {
      // save product for after login
      localStorage.setItem("pendingWishlist", item.id.toString());
      navigate("/login");
      return;
    }

    if (item.id) {
      dispatch(
        addProductToWishlist({
          productId: item.id,
        })
      );
    }
  };

  // OUT OF STOCK CHECK
  const isOutOfStock =
    item.inStock === false ||
    item.inStock === "false" ||
    item.inStock === 0;

  if (isProduct && isOutOfStock) {
    return null;
  }

  return (
    <div
      className="group px-4 relative"
      onClick={() =>
        navigate(
          isDeal
            ? `/deal-details/${item.category?.categoryId}/${item.title || item.name}/${item.id}`
            : `/product-details/${item.category?.categoryId}/${item.title || item.name}/${item.id}`
        )
      }
    >

      {/* CARD */}
      <div
        className="card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* IMAGES */}
        {item.images?.map((img, index) => (
          <img
            key={index}
            className="card-media object-top"
            src={img}
            alt=""
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
            }}
          />
        ))}

        {/* STOCK BADGE */}
        {isProduct && (
          <div className={`stock-badge ${item.inStock ? "in" : "out"}`}>
            {item.inStock ? "In Stock" : "Out Of Stock"}
          </div>
        )}

        {/* DEAL BADGE */}
        {isDeal && (
          <div className="deal-badge">
            DEAL
          </div>
        )}

        {/* ACTIONS */}
        {isHovered && isProduct && (
          <div className="indicator flex flex-col items-center space-y-2">

            <div className="flex gap-3">

              {/* WISHLIST */}
              <Button
                onClick={handleWishlist}
                variant="contained"
                color="secondary"
              >
                <Favorite sx={{ color: teal[500] }} />
              </Button>

              {/* COMMENT */}
              <Button variant="contained" color="secondary">
                <ModeComment sx={{ color: teal[500] }} />
              </Button>

            </div>

          </div>
        )}

      </div>

      {/* DETAILS */}
      <div className="details pt-3 space-y-1 group-hover-effect rounded-md">

        <div className="name">
          <h1>
            {item.seller?.businessDetails?.businessName}
          </h1>
          <p>{item.title || item.name}</p>
        </div>

        {/* PRICE */}
        <div className="price flex items-center gap-3">

          <span className="font-sans text-gray-800">
            ₹ {item.sellingPrice}
          </span>

          <span className="line-through text-gray-400">
            ₹ {item.mrpPrice}
          </span>

          <span className="text-primary-color font-semibold">
            {item.discountPercentage || item.discount}%
          </span>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;