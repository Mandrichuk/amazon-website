import {cart, deleteFromCart, productQuantityChange, fromFileToStorage } from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import {cartTotalQuantity} from './utils/total.js';
import {getDate} from './utils/time.js';
import {createID} from './utils/createID.js';
import {DeliveryDate} from './utils/delivery.js';

const cartEmptyText = document.querySelector('[data-cart-empty-text]');
const viewProductsBtn = document.querySelector('[data-view-products-btn]');

const orderLink = document.querySelector('[data-orders-link]');
const placeOrderBtn = document.querySelector('[data-place-order-button]');

export let totalCost = localStorage.getItem('totalCost');

if (!totalCost) {
  totalCost = 0;
}

export let order = createOrder(cart); 

if (window.location.pathname.includes('checkout.html')) {

  if (cart.length === 0) {
    cartEmptyText.classList.add('cart-empty-text-visible');
    viewProductsBtn.classList.add('view-products-btn-visible');

    orderLink.classList.add('orders-link-unable');
    placeOrderBtn.classList.add('place-order-button-unable');
  }

  // * order summary 
  
  function orderSummaryMath(length, deliveryCost) {
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
      shippingHandling = deliveryCost;
      
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
  
  orderSummaryMath(cart.length, 0);
  
  // * products grid 
  
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

      const freeDelivery = 0;
      const fastDelivery = 4.99;
      const priorityDelivery = 9.99;
  
      html += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date" data-delivery-date-${matchingProduct.id}>
        Delivery date: ${DeliveryDate(cartItem.preparingDate, 8)}
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
                name="delivery-option-${matchingProduct.id}" data-delivery-cost="${freeDelivery}" data-product-id="${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                ${DeliveryDate(cartItem.preparingDate, 8)}
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}" data-delivery-cost="${fastDelivery}" data-product-id="${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                ${DeliveryDate(cartItem.preparingDate, 3)}
                </div>
                <div class="delivery-option-price">
                  $${fastDelivery} - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}" data-delivery-cost="${priorityDelivery}" data-product-id="${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                ${DeliveryDate(cartItem.preparingDate, 1)}
                </div>
                <div class="delivery-option-price">
                  $${priorityDelivery} - Shipping
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



function deliveriesCostCount() {
  const deliveryOptions = document.querySelectorAll(".delivery-option-input");

  let deliveriesArray = [];
  deliveryOptions.forEach(deliveryOption => {
    deliveryOption.addEventListener('change', () => {
      if (deliveryOption.checked) {
        const deliveryCost = Number(deliveryOption.dataset.deliveryCost);
        const deliveryProductId = deliveryOption.dataset.productId;
        const deliveryDateText = document.querySelector(`[data-delivery-date-${deliveryProductId}]`);

        let deliveryDays = '';

        switch (deliveryCost) {
          case 0:
            deliveryDays = 8;
            break;
          case 4.99:
            deliveryDays = 3;
            break;
          case 9.99:
            deliveryDays = 1;
            break;
        }

        const existingIndex = deliveriesArray.findIndex(item => item.id === deliveryProductId);

        if (existingIndex !== -1) {
          deliveriesArray[existingIndex].cost = deliveryCost;
        }
        else {
          deliveriesArray.push({id: deliveryProductId, cost: deliveryCost});
        }

        let allDeliveriesCost = 0;
        deliveriesArray.forEach(delivery => {
          allDeliveriesCost += delivery.cost;
        });

        orderSummaryMath(cart.length, allDeliveriesCost);

        cart.forEach(product => {
          if (product.productId === deliveryProductId) {
            const deliveringDate = DeliveryDate(product.preparingDate, deliveryDays);
            product.deliveringDate = deliveringDate;

            deliveryDateText.innerHTML = "Delivery date: " + deliveringDate;
          }
        });

        createOrder(cart);
      }
    });
  });
}


deliveriesCostCount();



// * quantity update

function quantityUpdate() {
  document.querySelector('.js-items-quantity-title').innerHTML = cartTotalQuantity();
  document.querySelector('.js-items-quantity').innerHTML = cartTotalQuantity();
}
  
  
  quantityUpdate();
  
  // * delete link 
  
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
  
      deleteFromCart(productId);    
  
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
  
      cartItemContainer.remove();
      
      document.querySelector('.order-summary').innerHTML = generatingHTML(cart);
  
      document.querySelector('.js-items-quantity-title').innerHTML = cartTotalQuantity();
      document.querySelector('.js-items-quantity').innerHTML = cartTotalQuantity();
  
      orderSummaryMath(cart.length, 0);
      deliveriesCostCount();
  
      location.reload();
    });
  });
  
  
  
  // * update link 
  
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
  
      const saveContainer = document.querySelector(`.save-quantity-container-${productId}`);
      saveContainer.classList.add('visible-save-quantity-container');
      
      
      const updateContainer = document.querySelector(`.update-quantity-link-${productId}`);
      updateContainer.classList.add('invisible-update-quantity-link');
      
    });
  });
  
  
  
  // * save link 
  
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
  
  
      orderSummaryMath(cart.length, 0);
      deliveriesCostCount();
  
      quantityUpdate();
      productQuantity(productId);
    });
  });
}


function createOrder(cart) {
  const currentDate = getDate();
  const orderID = createID();
  totalCost = (Number(totalCost)).toFixed(2);
  
  cart.forEach(product => {
    if (product.deliveringDate === '') {
      const deliveringDate = DeliveryDate(product.preparingDate, 8);
      product.deliveringDate = deliveringDate;
    }
  });

  fromFileToStorage(cart);

  let order = {
    cart: cart,
    total: totalCost,
    date: currentDate,
    id: orderID
  };
  return order;
}