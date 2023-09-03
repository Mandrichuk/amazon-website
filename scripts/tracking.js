import { productData } from './orders.js';
import { products } from '../data/products.js';
import { cartTotalQuantity } from './utils/total.js'
import { getDate } from './utils/time.js';

let currentProduct;


const hearderCartQuantity = document.querySelector('.cart-quantity');
hearderCartQuantity.innerHTML = cartTotalQuantity();

const preparingDateComponents = productData.preparingDate.split('/');
const deliveryDateComponents = productData.deliveryDate.split('/');
const currentDateComponents = getDate().split('/');



products.forEach(product => {
    if (product.id === productData.id) {
        currentProduct = product;
    }
});


const innerHTML = `
    <div class="order-tracking">
    <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
    </a>

    <div class="delivery-date">
        Arriving on ${productData.deliveryDate}
    </div>

    <div class="product-info">
        ${currentProduct.name}
    </div>

    <div class="product-info">
        Quantity: ${productData.quantity}
    </div>

    <img class="product-image" src="${currentProduct.image}">

    <div class="progress-labels-container">
        <div class="progress-label progress-label-preparing">
        Preparing
        </div>
        <div class="progress-label progress-label-shipped">
        Shipped
        </div>
        <div class="progress-label progress-label-delivered">
        Delivered
        </div>
    </div>

    <div class="progress-bar-container">
        <div class="progress-bar"></div>
    </div>
    </div>
`;

const selecorDiv = document.querySelector('.main');
selecorDiv.innerHTML = innerHTML;



// * brogress bar


let preparingDate = new Date(
    parseInt(preparingDateComponents[2]),
    parseInt(preparingDateComponents[1]),
    parseInt(preparingDateComponents[0]) 
  );

let deliveryDate = new Date(
    parseInt(deliveryDateComponents[2]),
    parseInt(deliveryDateComponents[1]),
    parseInt(deliveryDateComponents[0]) 
  );

let currentDate = new Date(
    parseInt(currentDateComponents[2]),
    parseInt(currentDateComponents[1]),
    parseInt(currentDateComponents[0]) 
  );

preparingDate = preparingDate.toDateString();
deliveryDate = deliveryDate.toDateString();
currentDate = currentDate.toDateString();



const progressBar = document.querySelector('.progress-bar');

const labelPreparing = document.querySelector('.progress-label-preparing');
const labelShipped = document.querySelector('.progress-label-shipped');
const labelDelivered = document.querySelector('.progress-label-delivered');


if (currentDate === preparingDate) {
    progressBar.classList.add('progress-bar-preparing');
    labelPreparing.classList.add('current-status');
}
else if (currentDate < deliveryDate || currentDate > preparingDate) {
    progressBar.classList.add('progress-bar-shipped');
    labelShipped.classList.add('current-status');
}
else if (currentDate >= deliveryDate) {
    progressBar.classList.add('progress-bar-delivered');
    labelDelivered.classList.add('current-status');
}