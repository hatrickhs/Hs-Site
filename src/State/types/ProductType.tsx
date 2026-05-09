import { Review } from "./ReviewType";
import { Seller } from "./SellerTypes";

export interface Product{
    type: string;
    totalRatings: number;
    rating: number;
    inStock: any;
    id: number;
    // id?:number;
    title:string;
    description:string;
    mrpPrice: number;
    sellingPrice: number;
    discountPercentage: number;
    quantity: number;
    color:string;
    images: string[];
    numRatings?:number;
    category?:Category;
    seller?: Seller;
    createdAt?:Date;
    sizes:string;
    section?: string;
    Review: Review[];
    reviews?: Review[];
    price: number;
    discount: number;
    name: string;

}

interface Category{
    id?: number;
    name: string;
    categoryId: string;
    parentCategory?: Category;
    level: number;

}