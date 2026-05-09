
import React from 'react';
import ShopByCategoryCard from './ShopByCategoryCard';
import { useAppSelector } from '../../../../State/Store';
import { HomeCategory } from '../../../../State/types/HomeCategoryTypes';

const ShopByCategory = () => {
  const { customer } = useAppSelector(store => store);

  return (
    <div className='flex flex-wrap justify-between lg:px-20 gap-7'>
      {customer.categories.filter(item => item.section === "SHOP_BY_CATEGORIES").map((item: HomeCategory) => (
        <ShopByCategoryCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ShopByCategory;

