
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchProductById } from '../../../State/customer/ProductSlice';
import { addItemToCart } from '../../../State/customer/cartSlice';
import { addProductToWishlist } from '../../../State/customer/WishlistSlice';
import StarIcon from '@mui/icons-material/Star';
import { Button, Divider } from '@mui/material';
import { teal } from '@mui/material/colors';
import { AddShoppingCart, FavoriteBorder, Shield, WorkspacePremium, LocalShipping, Wallet } from '@mui/icons-material';
import SimilarProduct from './SimilarProduct';
import ReviewCard from '../Review/ReviewCard';
import WriteReviewModal from '../Review/WriteReviewModal';
import { fetchDealsByCategory } from '../../../State/admin/DealSlice';
import { fetchDealById } from '../../../State/admin/DealSlice';

interface Review {
  id: number;
  userName: string;
  createdAt: string;
  reviewRating: number;
  reviewText: string;
  productImages?: string[];
}

const ProductDetails = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector(state => state.product.product);
  const auth = useAppSelector(state => state.auth);
  const { category, id} = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const section = useParams().section || "PRODUCT";
  const jwt = localStorage.getItem('jwt');
  const deals = useAppSelector((state) => state.deal.filteredDeals);

useEffect(() => {
  if (!productId) return;

   console.log("section:", section);
  console.log("productId:", productId);

  if (section === "DEALS") {
    console.log("🔥 DEAL API CALL");
    dispatch(fetchDealById((productId)));
  } else {
    console.log("🟢 PRODUCT API CALL");
    dispatch(fetchProductById(productId));
  }
}, [productId, section]);


const handleAddToWishlist = () => { 
  if (!product?.id) return; 
  if (!jwt) { navigate("/login"); 
    return; 
  } if (auth.user?.role !== "ROLE_CUSTOMER") { 
    alert("Only customers can add products to wishlist"); 
    return; 
  } dispatch(addProductToWishlist({ productId: product.id })); 
  alert("Product added to wishlist "); 
  navigate("/wishlist"); 
};

const handleAddToCart = () => {
  if (!product?.id) return;

  const pendingProduct = { productId: product.id, quantity, size: "M" };
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    navigate("/login", {
      state: { from: "/cart", pendingProduct: pendingProduct },
    });
    return;
  }

  //  Role check
  if (auth.user?.role !== "ROLE_CUSTOMER") {
    alert("Only customers can add products to cart");
    return;
  }

  // Logged in → dispatch cart
  dispatch(addItemToCart({ jwt, request: pendingProduct }));

  alert("Product added to cart successfully ");
  navigate("/cart");
};

  useEffect(() => {
    if (!productId) return;

    const token = localStorage.getItem('jwt');

    fetch(`http://localhost:5000/api/products/${productId}/review`, {
    
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Reviews data from backend:", data);

        // map backend data to your Review interface
        const formattedReviews: Review[] = (data || []).map((r: any) => ({
          id: r.id,
          userName: r.userName || "Anonymous",     
          createdAt: r.createdAt || new Date().toISOString(),
          reviewRating: r.rating,                
          reviewText: r.reviewText,
          productImages: r.productImages,
        }));

        setReviews(formattedReviews);
      })
      .catch(err => console.error('Fetch reviews error:', err));
  }, [productId]);


  return (
    <div className="px-5 lg:px-20 pt-10">

      {/* Product Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex gap-5">
          <div className="w-[15%] flex flex-wrap lg:flex-col gap-3">
            {product?.images?.map((img, idx) => (
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
            <img src={product?.images?.[activeImage]} alt="" className="w-full rounded-md" />
          </div>
        </section>

        {/* Product Info */}
        <section>
          <h1 className="font-bold text-lg text-primary-color">
            {product?.seller?.businessDetails.businessName}
          </h1>
          <p className="text-gray-500 font-semibold">{product?.title}</p>

          {/* Ratings */}
          <div className="flex justify-between items-center py-2 border w-[180px] px-3 mt-5">
            <div className="flex items-center gap-1">
              <span>
                {reviews.length > 0
                  ? (reviews.reduce((sum, r) => sum + r.reviewRating, 0) / reviews.length).toFixed(1)
                  : 0}
              </span>
              <StarIcon sx={{ color: teal[500], fontSize: 17 }} />
            </div>
            <Divider orientation="vertical" flexItem />
            <span>{reviews.length} Ratings</span>
          </div>


          {/* Price */}
          <div className="mt-5">
            <div className="flex items-center gap-3 text-2xl">
              <span className="text-gray-800">₹{product?.sellingPrice}</span>
              <span className="line-through text-gray-400">₹{product?.mrpPrice}</span>
              <span className="text-primary-color font-semibold">{product?.discountPercentage}%</span>
            </div>
            <p className="text-sm">Inclusive of all taxes. Free Shipping above ₹1500.</p>
          </div>

          {/* Guarantee & Benefits */}
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4"><Shield sx={{ color: teal[500] }} /> Authentic & Quality Assured</div>
            <div className="flex items-center gap-4"><WorkspacePremium sx={{ color: teal[500] }} /> 100% Money Back Guarantee</div>
            <div className="flex items-center gap-4"><LocalShipping sx={{ color: teal[500] }} /> Free Shipping & Returns</div>
            <div className="flex items-center gap-4"><Wallet sx={{ color: teal[500] }} /> Pay on delivery might be available</div>
          </div>

          {/* Quantity */}
          <div className="mt-7 flex items-center gap-3">
            <Button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}> - </Button>
            <span>{quantity}</span>
            <Button onClick={() => setQuantity(quantity + 1)}> + </Button>
          </div>

          {/* Add To Bag & Wishlist */}
          <div className="mt-7 flex gap-5">
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddShoppingCart />}
              sx={{ py: 1 }}
              onClick={handleAddToCart}
            >
              Add To Bag
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FavoriteBorder />}
              sx={{ py: 1 }}
              onClick={handleAddToWishlist}
            >
              Wishlist
            </Button>
          </div>

          {/* Description */}
          <div className="mt-5">
            <p>{product?.description}</p>
          </div>
          
          {/* Reviews list */}
          <div className="mt-12 space-y-5 h-[170px] overflow-y-auto">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <ReviewCard
                  key={idx}
                  reviewId={review.id}
                  name={review.userName}
                  date={new Date(review.createdAt).toLocaleString()}
                  rating={review.reviewRating}
                  comment={review.reviewText}
                  avatarLetter={review.userName.charAt(0)}
                  imageUrl={review.productImages?.[0]}
                  onDeleted={() =>
                    setReviews(prev => prev.filter((_, i) => i !== idx))} />
              ))
            ) : (
              <p>No reviews available for this product.</p>
            )}

          </div>
        </section>
      </div>

      {/* Similar Products */}
      <div className="mt-20">
        <h1 className="text-lg font-bold">Similar Products</h1>
        <div className="pt-5">
          <SimilarProduct />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;



