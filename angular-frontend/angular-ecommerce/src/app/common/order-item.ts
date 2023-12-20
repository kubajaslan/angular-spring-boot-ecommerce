import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    productId: string;

    constructor(cartItem: CartItem){
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.imageUrl = cartItem.imageUrl;
        this.productId = cartItem.id;
    }
}
