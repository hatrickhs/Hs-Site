
import React from 'react';
import { HomeCategory } from '../../../../State/types/HomeCategoryTypes';
import { useNavigate } from 'react-router-dom';
import "./ShopByCategory.css";

const ShopByCategoryCard = ({ item }: { item: HomeCategory }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${item.categoryId}`); 
  };

  return (
    <div
      className='flex gap-3 flex-col justify-center items-center group cursor-pointer'
      onClick={handleClick}
    >
      <div className='custom-border w-[150px] h-[150px] lg:w-[170px] lg:h-[170px] rounded-full bg-primary-color'>
        <img
          className='rounded-full group-hover:scale-95 transition-transform duration-700 object-cover object-top h-full w-full'
          src={item.image}
          alt={item.name}
        />
      </div>
      <h1 className='font-semibold'>{item.name}</h1>
    </div>
  );
};

export default ShopByCategoryCard;

