import {cart, deleteFromCart, productQuantityChange} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import {cartTotalQuantity} from './utils/total.js';
import {getDate} from './utils/time.js';
import {createID} from './utils/createID.js';


export let totalCost = localStorage.getItem('totalCost');

if (!totalCost) {
  totalCost = 0;
}


if (window.location.pathname.includes('checkout.html')) {
  // * order summary order summary order summary order summary 
  
  function orderSummaryMath(length) {
    let orderSummary = 0;
    let shippingHandling = 0;
    let summaryAndShipping = 0;
    let summaryTax = 0;
    let totalFinal = 0;
  
  
    if (length > 0) {
      cart.forEach((inCartProduct) => {
        let productCost = 0; 
        products.forEach((product) => {
          if (inCartProduct.productId === product.id) {
            productCost = product.priceCents * inCartProduct.quantity;
            orderSummary += productCost;
          }
        });
      });
      
      
      orderSummary = orderSummary / 100;
      shippingHandling = 0;
      
      summaryAndShipping = Number(orderSummary) + Number(shippingHandling);
      summaryTax = summaryAndShipping / 10;
      
      totalFinal = Number(summaryAndShipping) + Number(summaryTax);
    }
  
    document.querySelector('.js-payment-summary-money').innerHTML = '$' + (orderSummary).toFixed(2);
    document.querySelector('.js-shipping-handling').innerHTML = '$' + (shippingHandling).toFixed(2);
    
    document.querySelector('.js-total-before-tax').innerHTML = '$' + (summaryAndShipping).toFixed(2);
    document.querySelector('.js-total-tax').innerHTML = '$' + (summaryTax).toFixed(2);
    
    document.querySelector('.js-order-total').innerHTML = '$' + (totalFinal).toFixed(2);
    localStorage.setItem('totalCost', totalFinal);
  }
  
  orderSummaryMath(cart.length);
  
  // * products grid products grid products grid products grid
  
  function generatingHTML(cart) {
  
    let html = '';
  
    cart.forEach((cartItem) => {
      const productId = cartItem.productId;
  
      let matchingProduct;
  
      products.forEach((product) => {
        if (productId === product.id) {
          matchingProduct = product;
        }
      });
  
      html += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>
      
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">
      
          <div class="cart-item-details">
            <div class="product-name">
            ${matchingProduct.name}
            </div>
            <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                Quantity: <span class="quantity-label quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link update-quantity-link-${matchingProduct.id}  link-primary js-update-link" data-product-id="${matchingProduct.id}" >
                Update
              </span>
  
              <div class="save-quantity-container save-quantity-container-${matchingProduct.id}">
                <input class="product-quantity-input product-quantity-input-${matchingProduct.id}">
  
                <span class="save-quantity-link js-save-quantity-link-${matchingProduct.id} js-save-link link-primary" data-product-id="${matchingProduct.id}">
                Save
                </span>
              </div>
  
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>
      
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    });
    return html;
  }
  
  
  document.querySelector('.order-summary').innerHTML = generatingHTML(cart);
  
  function quantityUpdate() {
    document.querySelector('.js-items-quantity-title').innerHTML = cartTotalQuantity();
    document.querySelector('.js-items-quantity').innerHTML = cartTotalQuantity();
  }
  
  
  quantityUpdate();
  
  // * delete link delete link delete link delete link 
  
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
  
      deleteFromCart(productId);    
  
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
  
      cartItemContainer.remove();
      
      document.querySelector('.order-summary').innerHTML = generatingHTML(cart);
  
      document.querySelector('.js-items-quantity-title').innerHTML = cartTotalQuantity();
      document.querySelector('.js-items-quantity').innerHTML = cartTotalQuantity();
  
      orderSummaryMath(cart.length);
  
      location.reload();
    });
  });
  
  
  
  // * update link update link update link update link 
  
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
  
      const saveContainer = document.querySelector(`.save-quantity-container-${productId}`);
      saveContainer.classList.add('visible-save-quantity-container');
      
      
      const updateContainer = document.querySelector(`.update-quantity-link-${productId}`);
      updateContainer.classList.add('invisible-update-quantity-link');
      
    });
  });
  
  
  
  // * save link save link save link save link 
  
  function userInputValidate(userInput, productId) {
  
    if (typeof(userInput) === 'string' && !isNaN(userInput)) {
      if (Number(userInput) > 0) {
        return productQuantityChange(userInput, productId);
      } else {
        alert('The input number must be higher than 0!')
      }
    } else {
      alert('The input must be a number!');
    }
  }
  
  
  function productQuantity(productId) {
    cart.forEach((cartProduct) => {
      if (cartProduct.productId === productId) {
        document.querySelector(`.quantity-label-${productId}`).innerHTML = cartProduct.quantity;
      }
    });
  }
  
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
  
      const userInput = document.querySelector(`.product-quantity-input-${productId}`).value;
  
      userInputValidate(userInput, productId);
  
      const saveContainer = document.querySelector(`.save-quantity-container-${productId}`);
      saveContainer.classList.remove('visible-save-quantity-container');
  
      const updateContainer = document.querySelector(`.update-quantity-link-${productId}`);
      updateContainer.classList.remove('invisible-update-quantity-link');
  
  
      orderSummaryMath(cart.length);
  
      quantityUpdate();
      productQuantity(productId);
    });
  });
}


const currentDate = getDate();
const orderID = createID();


totalCost = (Number(totalCost)).toFixed(2);


export let order = {
  cart: cart,
  total: totalCost,
  date: currentDate,
  id: orderID
};
