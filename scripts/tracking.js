import { productData } from './orders.js';
import { products } from '../data/products.js';
import { getDate } from './utils/time.js';

let currentProduct;

const deliveryDateWithDashes = productData.deliveryDate.replace(/\//g, '-');
const preparingDateWithDashes = productData.preparingDate.replace(/\//g, '-');
console.log(deliveryDateWithDashes)
console.log(preparingDateWithDashes)


products.forEach(product => {
    if (product.id === productData.id) {
        currentProduct = product;
    }
});

// TODO ! create an algorihm that will show the bar progress 


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
        <div class="progress-label">
        Preparing
        </div>
        <div class="progress-label current-status">
        Shipped
        </div>
        <div class="progress-label">
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