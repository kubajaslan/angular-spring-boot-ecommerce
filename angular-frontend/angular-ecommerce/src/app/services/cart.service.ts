import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(newCartItem: CartItem) {
    let alreadyExistsInTheCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(item => item.id === newCartItem.id);

      alreadyExistsInTheCart = (existingCartItem != undefined);

    }

    if (alreadyExistsInTheCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(newCartItem);
    }

    this.computeCartTotal();

  }

  removeFromCart(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    }

    this.computeCartTotal();
  }

  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentItem of this.cartItems) {
      totalPriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }

  remove(cartItem: CartItem) {
    const index = this.cartItems.findIndex(item => item.id === cartItem.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }
}
