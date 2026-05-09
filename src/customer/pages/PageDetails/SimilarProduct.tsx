
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../State/Store';
import { fetchAllProducts } from '../../../State/customer/ProductSlice';
import SimilarProductCard from './SimilarProductCard';

const SimilarProduct = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.product.products || []);

  useEffect(() => {
    dispatch(fetchAllProducts({ pageNumber: 0 }));
  }, [dispatch]);

  return (
    <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 gap-y-8 place-items-center">
      {products.map(product => (
        <SimilarProductCard key={product.id} item={product} />
      ))}
    </div>
  );
};

export default SimilarProduct;


