import { cart, deleteAllFromCart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { order } from './checkout.js';
import { cartTotalQuantity } from './utils/total.js';

// localStorage.clear();

let productData = JSON.parse(localStorage.getItem('productData'));
if (!productData) productData = {};

 
const currentPagePath = window.location.pathname;
const referrer = document.referrer;

let orders = JSON.parse(localStorage.getItem('orders'));

if (!orders) orders = [];

if (order.cart.length > 0 && referrer.includes('checkout')) {
  orders.push(order);
  orders.reverse();
}


if (currentPagePath.includes('orders')) {
  
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
        
        <div class="product-details" data-product-details-${product.id}>
        <div class="product-name">
        ${product.name}
        </div>
        <div class="product-delivery-date">
        Arriving on: ${orderProduct.deliveringDate}
        </div>
        <div class="product-quantity">
      Quantity: ${orderProduct.quantity}
      </div>
      <button class="buy-again-button button-primary" data-product-id="${product.id}" data-order-id="${order.id}" data-product-quantity="${orderProduct.quantity}">
      <img class="buy-again-icon" src="images/icons/buy-again.png">
      <span class="buy-again-message">Buy it again</span>
      </button>
      </div>
      
      <div class="product-actions">
      <a href="tracking.html">
      <button class="track-package-button button-secondary" data-product-id="${product.id}" data-delivery-date="${orderProduct.deliveringDate}" data-preparing-date="${orderProduct.preparingDate}" data-product-quantity="${orderProduct.quantity}">
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

// * buy it again btn

document.querySelectorAll('.buy-again-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const productId = btn.dataset.productId;
    const productQuantity = btn.dataset.productQuantity;
    const orderId = btn.dataset.orderId;
    
    products.forEach(product => {
      if (productId === product.id) {
        addToCart(productId, productQuantity);
        document.querySelector('.cart-quantity').innerHTML = cartTotalQuantity();
        
        
        document.querySelectorAll(`[data-product-id="${productId}"]`)
        .forEach(buyBtn => {
          
          const btnProductId = buyBtn.dataset.productId;
          const btnOrderId = buyBtn.dataset.orderId;
          
          if (btnProductId === productId && btnOrderId === orderId) {
            
            buyBtn.innerHTML = '&#10003; Added';
            setTimeout(() => {
              buyBtn.innerHTML = `
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
              `;
              
            }, 2000);
          }
        });
      }
    });
  });
});
}


function getProductData() {
  const trackBtns = document.querySelectorAll('.track-package-button');
  trackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const productQuantity = btn.dataset.productQuantity;
      const preparingDate = btn.dataset.preparingDate;
      const deliveryDate = btn.dataset.deliveryDate;
      
      const productData = {
        id: productId,
        quantity: productQuantity,
        preparingDate: preparingDate,
        deliveryDate: deliveryDate
      };

      localStorage.setItem('productData', JSON.stringify(productData));
      return productData;
    });
  });
}

getProductData();


export { productData };