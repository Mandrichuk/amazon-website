export let cart = JSON.parse(localStorage.getItem('cart'));

if  (!cart) {
cart = [{
  productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2
},
{
  productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity: 1
}];
}


function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(productId, productValue) {
  productValue = Number(productValue);
  let productExists;

  cart.forEach((product) => {
    if (product.productId === productId) {
      productExists = product;
    }
  });
  
  if (productExists) {
    productExists.quantity += productValue;
  } else {
    cart.push({
      productId: productId,
      quantity: productValue
    });
  }
  saveToStorage();
}


export function deleteFromCart(removeId) {
  const renewCart = [];

  cart.forEach((product) => {
    if (product.productId !== removeId) {
      renewCart.push(product);
    }
  });
  cart = renewCart;

  saveToStorage();
}

export function deleteAllFromCart() {
  cart = [];

  saveToStorage();
}


export function productQuantityChange(userQuantity, productId) {
  cart.forEach((cartProduct) => {
    if (productId === cartProduct.productId) {
      cartProduct.quantity = Number(userQuantity);
    }
  });

  saveToStorage();
}