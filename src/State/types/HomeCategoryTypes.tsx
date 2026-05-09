import { Deal } from "./DealTypes";

export interface HomeData {
  id: number;
  grid: HomeCategory[];
  shopByCategories: HomeCategory[];
  electricCategories: HomeCategory[];
  deals: Deal[];
  dealCategories: HomeCategory[];
}

export interface CategoryItem {
  mainCategory: string;
  levelTwoCategory: string;
  levelThreeCategory: string;
  image: string;
  imageFile: File | null;
  categoryId: string;
  section: string;
  name: string;
  discount: number;
}

export interface HomeCategory {
  discount: number;
  shopByCategories: CategoryItem[];
  deals: CategoryItem[];
  electricCategories: CategoryItem[];
  grid: CategoryItem[];
  id?: number;
  categoryId: string;
  mainCategory: string;
  section?: string;
  name?: string;
  image: string;
  parentCategoryId?: string;
  categorySection?: string;
  levelTwoCategory?: string;
  levelThreeCategory?: string;
}
