import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeCategory } from "../../../../State/types/HomeCategoryTypes";

const DealCategoryCard = ({ item }: { item: HomeCategory }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-[10rem] cursor-pointer"
      onClick={() => navigate(`/products/${item.id}`)}
    >
      <img
        src={item.image}
        className="w-full h-[9rem] object-cover"
      />

      <div className="bg-black text-white p-2 text-center">
        <p>{item.name}</p>
      </div>
    </div>
  );
};

export default DealCategoryCard;