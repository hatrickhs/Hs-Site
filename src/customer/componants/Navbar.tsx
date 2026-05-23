
import {
  Avatar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { AddShoppingCart, Favorite, Storefront } from "@mui/icons-material";
import CategorySheet from "./CategorySheet";
import { mainCategory } from "../../data/category/mainCategory";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../State/Store";
import { RootState } from '../../State/Store';

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const seller = useAppSelector(state => state.seller);
  const auth = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const cartCount = useAppSelector(
    state => state.cart?.cart?.cartItems?.length || 0
  );
  const wishlist = useAppSelector(state => state.wishlist.wishlist);
  const wishlistCount = wishlist?.products?.length || 0;

  return (
    <Box className="sticky top-0 left-0 right-0 bg-white" sx={{ zIndex: 2 }}>
      <div className="flex items-center justify-between px-5 lg:px-20 h-[70px] border-b">
        <div className="flex item-center gap-9">
          <div className="flex items-center gap-2">
            {!isLarge && <IconButton><MenuIcon /></IconButton>}
            <h1 onClick={() => navigate("/")} className="logo cursor-pointer text-lg md:text-2xl text-primary-color">
              HS Site
            </h1>
          </div>
          <ul className="flex items-center font-medium text-gray-800">
            {mainCategory.map((item, index) => (
              <li
                key={index}
                onMouseEnter={() => {
                  setShowCategorySheet(true);
                  if (item.categoryId) setSelectedCategory(item.categoryId);
                }}
                onMouseLeave={() => setShowCategorySheet(false)}
                className="mainCategory hover:text-primary-color hover:border-b-2 h-[70px] px-4 border-primary-color flex items-center"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-1 lg:gap-6 items-center">
          <IconButton onClick={() => navigate("/search")}><SearchIcon /></IconButton>

          {seller.profile || auth.user ? (
            <Button

              onClick={() => {
                if (auth.user?.role === "ROLE_ADMIN") {
                  navigate("/admin");
                } else if (auth.user?.role === "ROLE_SELLER") {
                  navigate("/seller");
                } else {
                  navigate("/account/orders");
                }
              }}

            >
              <Avatar
                sx={{ width: 29, height: 29 }}
                src={
                  seller.profile?.image ||
                  (auth.user as any)?.image ||
                  "https://cdn.pixabay.com/photo/2015/04/15/09/28/head-723540_640.jpg"
                }
              />
              <h1 className="font-semibold hidden lg:block">
                {seller.profile?.sellerName || auth.user?.fullName || "Profile"}
              </h1>
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")} variant="contained">
              Login
            </Button>
          )}

          {/* Only show for CUSTOMER */}
          {auth.user?.role === "ROLE_CUSTOMER" && (
            <>
              <IconButton onClick={() => navigate("/wishlist")}>
                <Badge badgeContent={wishlistCount} color="success">
                  <Favorite
                    sx={{ color: wishlistCount > 0 ? "green" : "gray", fontSize: 29 }}
                  />
                </Badge>
              </IconButton>

              <IconButton onClick={() => navigate("/cart")}>
                <Badge badgeContent={cartCount} color="primary">
                  <AddShoppingCart sx={{ fontSize: 29, color: "gray" }} />
                </Badge>
              </IconButton>
            </>
          )}

          {isLarge && (
            <Button onClick={() => navigate("/become-seller")} startIcon={<Storefront />} variant="outlined">
              Become Seller
            </Button>
          )}
        </div>
      </div>

      {showCategorySheet && (
        <div
          onMouseLeave={() => setShowCategorySheet(false)}
          onMouseEnter={() => setShowCategorySheet(true)}
          className="categorySheet absolute top-[4.41rem] left-20 right-20 border"
        >
          <CategorySheet 
          selectedCategory={selectedCategory}
          setShowCategorySheet={setShowCategorySheet}
          />
        </div>
      )}
    </Box>
  );
};

export default Navbar;
