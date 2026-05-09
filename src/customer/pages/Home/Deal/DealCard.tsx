
import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeCategory } from "../../../../State/types/HomeCategoryTypes";

const DealCard = ({ item }: { item: HomeCategory }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/products/${item.id}?section=DEALS`);
  

  return (
    <div className="w-[10rem] cursor-pointer" onClick={handleClick}>
      <img
        className="border-x-[7px] border-t-[7px] border-pink-600 w-full h-[9rem] object-cover object-top"
        src={item.image}
        alt={item.name}
      />
      <div className="border-1 border-black bg-black text-white p-2 text-center">
        <p className="text-lg font-semibold">{item.name}</p>
        <p className="text-2xl font-bold">{item.discount}% OFF</p>
        <p className="text-balance text-lg">Shop now</p>
      </div>
    </div>
  );
};

export default DealCard;
