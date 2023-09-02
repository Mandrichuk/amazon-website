import { productData } from './orders.js';
import { products } from '../data/products.js';
import { getDate } from './utils/time.js';

let currentProduct;


const preparingDateComponents = productData.preparingDate.split('/');
const deliveryDateComponents = productData.deliveryDate.split('/');
const currentDateComponents = getDate().split('/');



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


console.log("preparing date " + preparingDate);
console.log("delivery date " + deliveryDate);
console.log("current date " + currentDate);




const progressBar = document.querySelector('.progress-bar');


if (currentDate >= deliveryDate) {
    progressBar.classList.add('progress-bar-delivered');

    console.log('delivered');
}
else if (currentDate === preparingDate) {
    progressBar.classList.add('progress-bar-preparing');
    
    console.log('preparing');
}
else if (currentDate < deliveryDate || currentDate > preparingDate) {
    progressBar.classList.add('progress-bar-shipped');

    console.log('shipped');
}
else {
    console.log('nothing');
}