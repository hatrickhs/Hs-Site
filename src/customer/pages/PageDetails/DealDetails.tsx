
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchDealById,
  fetchDealsByCategory,
} from "../../../State/admin/DealSlice";
import { addItemToCart } from "../../../State/customer/cartSlice";
import { addDealToWishlist, addProductToWishlist } from "../../../State/customer/WishlistSlice";

import StarIcon from "@mui/icons-material/Star";
import { Button, Divider } from "@mui/material";
import { teal } from "@mui/material/colors";
import {
  AddShoppingCart,
  FavoriteBorder,
  Shield,
  WorkspacePremium,
  LocalShipping,
  Wallet,
  Delete,
} from "@mui/icons-material";

import ReviewCard from "../Review/ReviewCard";

interface Review {
  id: number;
  userName: string;
  createdAt: string;
  reviewRating: number;
  reviewText: string;
}

const DealDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const deal = useAppSelector((state) => state.deal.selectedDeal);
  const deals = useAppSelector((state) => state.deal.filteredDeals);
  const auth = useAppSelector((state) => state.auth);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    console.log("CALLING API FOR:", productId);
    if (productId) dispatch(fetchDealById(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    if (deal?.categoryId) {
      dispatch(
        fetchDealsByCategory({
          categoryId: deal.categoryId,
          section: "DEALS",
        })
      );
    }
  }, [deal?.categoryId, dispatch]);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/deals/${productId}/review`
        );

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : data?.reviews || [];

        const formatted = list.map((r: any) => ({
          id: r.id,
          userName: r.userName || "User",
          createdAt: r.createdAt || new Date().toISOString(),
          reviewRating: r.reviewRating || r.rating,
          reviewText: r.reviewText,
        }));

        setReviews(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleAddToCart = () => {
    if (!deal?.id) return;

    const payload = { dealId: deal.id, quantity, size: "M" };

    if (!jwt) {
      navigate("/login", {
        state: { from: "/cart", payload },
      });
      return;
    }

    if (auth.user?.role !== "ROLE_CUSTOMER") {
      alert("Only customers allowed");
      return;
    }

    dispatch(addItemToCart({ jwt, request: payload }));
    navigate("/cart");
  };

  const handleAddToWishlist = () => {
    if (!deal?.id) return;

    if (!jwt) return navigate("/login");

    if (auth.user?.role !== "ROLE_CUSTOMER") {
      alert("Only customers allowed");
      return;
    }

    dispatch(addDealToWishlist({ dealId: deal.id }));
    navigate("/wishlist");
  };

  return (
    <div className="px-5 lg:px-20 pt-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <section className="flex gap-5">
          <div className="w-[15%] flex flex-wrap lg:flex-col gap-3">
            {deal?.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="w-[50px] cursor-pointer rounded-md"
                onClick={() => setActiveImage(idx)}
              />
            ))}
          </div>
          <div className="w-[85%]">
            <img src={deal?.images?.[activeImage]} alt="" className="w-full rounded-md" />
          </div>
        </section>

        <section>

          <h1 className="font-bold text-lg text-primary-color">
            {deal?.category?.name}
          </h1>

          <p className="text-gray-500 font-semibold">
            {deal?.name}
          </p>

          <div className="flex justify-between items-center border w-[180px] px-3 mt-5 py-2">
            <div className="flex items-center gap-1">
              <span>
                {reviews.length
                  ? (
                    reviews.reduce((a, b) => a + b.reviewRating, 0) /
                    reviews.length
                  ).toFixed(1)
                  : 0}
              </span>
              <StarIcon sx={{ color: teal[500], fontSize: 17 }} />
            </div>
            <Divider orientation="vertical" flexItem />
            <span>{reviews.length} Ratings</span>
          </div>

          <div className="mt-5 flex gap-3 text-2xl">
            <span>₹{deal?.sellingPrice}</span>
            <span className="line-through text-gray-400">
              ₹{deal?.mrpPrice}
            </span>
            <span className="text-green-600">
              {deal?.discount}%
            </span>
          </div>

          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4"><Shield sx={{ color: teal[500] }} /> Authentic & Quality Assured</div>
            <div className="flex items-center gap-4"><WorkspacePremium sx={{ color: teal[500] }} /> 100% Money Back Guarantee</div>
            <div className="flex items-center gap-4"><LocalShipping sx={{ color: teal[500] }} /> Free Shipping & Returns</div>
            <div className="flex items-center gap-4"><Wallet sx={{ color: teal[500] }} /> Pay on delivery might be available</div>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <Button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}> - </Button>
            <span>{quantity}</span>
            <Button onClick={() => setQuantity(quantity + 1)}> + </Button>
          </div>

          <div className="mt-7 flex gap-5">
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
            >
              Add To Bag
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FavoriteBorder />}
              onClick={handleAddToWishlist}
            >
              Wishlist
            </Button>
          </div>

          <div className="mt-10 space-y-4 h-[200px] overflow-y-auto">

            {reviews.length ? (
              reviews.map((r) => {
                console.log("REVIEW FROM STATE:", r.id);

                return (
                  <div key={r.id} className="relative">
                    <ReviewCard
                      reviewId={r.id}
                      name={r.userName}
                      date={new Date(r.createdAt).toLocaleString()}
                      rating={r.reviewRating}
                      comment={r.reviewText}
                      avatarLetter={r.userName.charAt(0)}
                      onDeleted={() => handleDeleteReview(r.id)}
                    />
                  </div>
                );
              })
            ) : (
              <p>No reviews available</p>
            )}
          </div>

        </section>
      </div>

      <div className="mt-20">
        <h2 className="font-bold text-lg">Similar Deals</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
          {deals.map((d) => (
            <div
              key={d.id}
              className="border p-3 cursor-pointer"
              onClick={() =>
                navigate(`/Deal-details/${d.id}`)
              }
            >
              <img src={d.images?.[0] || "/default-deal.png"} className="h-40 w-full object-cover" />
              <p>{d.name}</p>
              <p className="text-green-600">₹{d.sellingPrice}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DealDetails;