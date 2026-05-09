export interface Review {
  id: number;
  reviewText: string;
  rating: number;
  createdAt: string;
  productImages: string[];
  user: {
    id: number;
    name: string;
  };
}

