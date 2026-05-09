
import React from 'react';
import { HomeCategory } from '../../State/types/HomeCategoryTypes';
import { useNavigate } from 'react-router-dom';

const ElectricCategoryCart = ({ item }: { item: HomeCategory }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${item.categoryId}`); 
  };

  return (
    <div
      className='flex flex-col gap-2 justify-center items-center cursor-pointer'
      onClick={handleClick} 
    >
      <img
        className='object-contain h-10'
        src={item.image}
        alt={item.name}
      />
      <h2 className='font-semibold text-sm text-center'>{item.name}</h2>
    </div>
  );
};

export default ElectricCategoryCart;
