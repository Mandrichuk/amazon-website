import { cart, deleteAllFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { order } from './checkout.js';
import { cartTotalQuantity } from './utils/total.js';



const referrer = document.referrer;
let orders = JSON.parse(localStorage.getItem('orders'));

if (!orders) orders = [];

if (order.cart.length > 0 && referrer === 'http://127.0.0.1:5500/checkout.html') {
  orders.push(order);
  orders.reverse();
}



let ordersGrid = document.querySelector('.orders-grid');
ordersGrid.innerHTML = '';

orders.forEach(order => {
  let orderDetailsHTML = '';

  order.cart.forEach(orderProduct => {
    const product = products.find(product => orderProduct.productId === product.id);

    if (product) {
      orderDetailsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        
        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${order.date}
          </div>
          <div class="product-quantity">
            Quantity: ${orderProduct.quantity}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        
        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    }
  });

  let orderHTML = `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${order.date}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${order.total}</div>
          </div>
        </div>
        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>
      <div class="order-details-grid">
        ${orderDetailsHTML}
      </div>
    </div>
  `;

  ordersGrid.innerHTML += orderHTML;

});

localStorage.setItem('orders', JSON.stringify(orders));

if (referrer === 'http://127.0.0.1:5500/checkout.html') {
  deleteAllFromCart();
}


document.querySelector('.cart-quantity').innerHTML = cartTotalQuantity();