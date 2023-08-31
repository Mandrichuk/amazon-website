import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js'
import {cartTotalQuantity} from './utils/total.js'

let productsHTML = '';


products.forEach((product) => {
  productsHTML += `
    <div class="product-container" data-product-container-${product.id}>
    <div class="product-image-container">
    <img class="product-image"
    src="${product.image}">
    </div>
    
    <div class="product-name limit-text-to-2-lines" data-product-name-${product.id}>
    ${product.name}
    </div>
    
    <div class="product-rating-container">
    <img class="product-rating-stars"
    src="images/ratings/rating-${product.rating.stars * 10}.png">
    <div class="product-rating-count link-primary">
    ${product.rating.count}
    </div>
    </div>
    
    <div class="product-price">
    $${formatCurrency(product.priceCents)}
    </div>
    
    <div class="product-quantity-container">
    <select class="js-quantity-seletor-${product.id}">
    <option selected value="1">1</option>
    <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        </div>
        
        <div class="product-spacer"></div>
        
        <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
        </div>
        
        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
        </button>
        </div>
        `;
      });

// *

function adddedTextArise(addedTextDiv) {
  addedTextDiv.classList.add('added-to-cart-click');
  
  setTimeout(() => {
    addedTextDiv.classList.remove('added-to-cart-click');
  }, 1500);
  
}

document.querySelector('.cart-quantity').innerHTML = cartTotalQuantity();

document.querySelector('.js-products-grid').innerHTML = productsHTML;

document.querySelectorAll('.js-add-to-cart').forEach((btn) => {
  btn.addEventListener('click', () => {
    const productId = btn.dataset.productId;


    const quantitySelector = document.querySelector(`.js-quantity-seletor-${productId}`);
    const productValue = quantitySelector.value;


    addToCart(productId, productValue);
    document.querySelector('.cart-quantity').innerHTML = cartTotalQuantity();

    // *

    const addedTextDiv = document.querySelector(`.js-added-to-cart-${productId}`);
    adddedTextArise(addedTextDiv);

    setTimeout(() => {
      addedTextDiv.classList.remove('.added-to-cart-click');
    }, 2000); 
  });
});



// * search bar

function findBySearch(value) {
  // * cards show by the input text  
  let coincidenceCount = 0;
  let visibleProductCount = 0;
  
  products.forEach(product => {
    const productName = product.name.toLowerCase();
    const productKeywords = product.keywords;

    const resultText = document.querySelector('.results-for-text');
    const noResultText = document.querySelector('.no-results-text');

    resultText.classList.add('results-for-text-invisible');
    noResultText.classList.add('no-results-text-invisible');


    let isVisible = productName.includes(value);

    if (isVisible) visibleProductCount++;

    
    if (!isVisible) {
      productKeywords.forEach(keyword => {
        if (keyword === value) {
          isVisible = true;
          coincidenceCount++;
        }
      });

      if (coincidenceCount > 0) {
        resultText.classList.remove('results-for-text-invisible');
        resultText.innerHTML = `Results for: "${value}"`; 
      } 
      else if (coincidenceCount <= 0 && visibleProductCount <= 0) {
        noResultText.classList.remove('no-results-text-invisible');
        document.querySelector('.no-results-text').innerHTML = `Sorry there are no results for "${value}"`;
      }
    }
    


    const productContainer = document.querySelector(`[data-product-container-${product.id}]`);
    
    productContainer.classList.toggle('hide', !isVisible);
    
    // * highlight the input text
    
    const cardName = document.querySelector(`[data-product-name-${product.id}]`);
    
    cardName.innerHTML = highlightMatches(productName, value);
      
    });
}


function highlightMatches(text, searchValue) {
  const re = new RegExp(searchValue, 'gi');
  return text.replace(re, match => `<span class="highlight">${match}</span>`);
}


function searchBtnOnClick() {
  const searchInput = document.querySelector('[data-search-input]').value;
  findBySearch(searchInput);
}


document.body.addEventListener('keydown', event => {
  if (event.key === "Enter") {
    searchBtnOnClick();
  }
});

const searchBtn = document.querySelector('[data-search-button]');
searchBtn.addEventListener('click', searchBtnOnClick);


searchBtnOnClick();


// * scroll to top

const scrollToTopButton = document.querySelector('.scrollToTopButton');
let lastScrollY = window.scrollY;

document.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY < lastScrollY && currentScrollY > 550) {
    scrollToTopButton.style.display = "block";
  }
  else {
    scrollToTopButton.style.display = "none";
  }
  lastScrollY = currentScrollY;
});

scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0, 
    behavior: "smooth"
  })
});