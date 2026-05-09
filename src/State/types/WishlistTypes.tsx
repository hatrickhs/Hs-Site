import { Deal } from "./DealTypes";
import { Product } from "./ProductType";
import { User } from "./userTypes";

export interface Wishlist {
    id: number;
    user: User;
    products: Product[];
    deals: Deal[];
}

export interface WishlistState {
    wishlist: Wishlist | null;
    loading: boolean;
    error: string | null;
}

export interface AddProductToWishlistPayload {
    wishlistId: number;
    productId: number;
}