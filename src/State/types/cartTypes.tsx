import { Deal } from "./DealTypes";
import { Product } from "./ProductType";
import { User } from "./userTypes";

export interface ProductCartItem {
    id: number;
    cart?: Cart;
    product: Product;
    deal?: null;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    userId: number;
    type: "PRODUCT";
}

export interface DealCartItem {
    id: number;
    cart?: Cart;
    product?: null;
    deal: Deal;
    size: string;
    quantity: number;
    mrpPrice: number;
    sellingPrice: number;
    userId: number;
    type: "DEAL";
}

export type CartItem = ProductCartItem | DealCartItem;

export interface Cart {
    code: any;
    id: number;
    user: User;
    cartItems: CartItem[];
    totalSellingPrice: number;
    totalItem: number;
    totalMrpPrice: number;
    discount: number;
    couponDiscount: number;
    couponCode: string | null;
}