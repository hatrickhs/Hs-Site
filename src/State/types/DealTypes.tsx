import { string } from "yup";
import { HomeCategory } from "./HomeCategoryTypes";
import { Seller } from "./SellerTypes";
import { User } from "./userTypes";

export interface Deal {
  levelThreeCategory: string;
  levelTwoCategory: string;
  mainCategory: string;
  id: number;
  name: string;
  images: string[];
  discount?: number;
  mrpPrice: number;
  sellingPrice : number;
  categoryId?: number;
  category: HomeCategory;
  categoryName?: string;
   seller?: Seller;
}

export interface ApiResponse {
  mesage: string;
  status: boolean;
}
export interface HomeDeal {
  id: number;
  name: string;
  images: string[];
  discount?: string;
  price?: number;
  oldPrice?: number;
  categoryId?: string | number;
}


export interface DealsState {
  deals: Deal[];
  filteredDeals: Deal[];
  selectedDeal: Deal | null;
  loading: boolean;
  error: string | null;
  dealCreated: boolean;
  dealUpdated: boolean;
}

export interface CreateDealRequest {
  discount: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
}
