
import React, { useEffect } from "react";
import WishlistProductCard from "./WishlistProductCard";
import store, { useAppDispatch, useAppSelector } from "../../State/Store";
import { getWishlistByUserId } from "../../State/customer/WishlistSlice";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((store) => store.wishlist);

  useEffect(() => {
    dispatch(getWishlistByUserId());
  }, [dispatch]);

  return (
    <div className="h-[85vh] p-5 lg:p-20">
      <section>

        <h1>
          <strong>My Wishlist</strong>{" "}
          {(wishlist?.products?.length || 0) +
            (wishlist?.deals?.length || 0)} items
        </h1>

        <div className="pt-10 flex flex-wrap gap-5">

          {wishlist?.products?.map((item, index) => (
            <WishlistProductCard
              key={`p-${index}`}
              item={item}
              type="PRODUCT"
            />
          ))}

          {wishlist?.deals?.map((item: any, index: number) => (
            <WishlistProductCard
              key={`d-${index}`}
              item={{
                ...item,
                title: item.name,
                images: item.images,
                discountPercentage: item.discount,
              }}
              type="DEAL"
            />
          ))}

        </div>
      </section>
    </div>
  );
};

export default Wishlist;