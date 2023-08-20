import {cart} from '../../data/cart.js'

export function cartTotalQuantity() {
  let totalQuantity = 0;

  cart.forEach((item) => {
    totalQuantity += Number(item.quantity);
}); 

  return totalQuantity;
};