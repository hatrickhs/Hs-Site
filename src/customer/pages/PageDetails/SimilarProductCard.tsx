
import React from 'react';
import { Product } from '../../../State/types/ProductType';
import { useNavigate } from 'react-router-dom';

interface Props {
  item: Product;
}

const SimilarProductCard = ({ item }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer border rounded-md p-3 hover:shadow-lg transition"
    >
      <img
        src={item.images?.[0] || ''}
        alt={item.title}
        className="w-full h-[150px] object-cover rounded-md"
      />
      <h1 className="font-semibold text-sm mt-2">{item.title}</h1>
      <p className="text-xs text-gray-500">{item.seller?.businessDetails.businessName}</p>
      <div className="flex gap-2 mt-1">
        <span className="text-sm font-medium">₹{item.sellingPrice}</span>
        <span className="line-through text-xs text-gray-400">₹{item.mrpPrice}</span>
      </div>
    </div>
  );
};

export default SimilarProductCard;
