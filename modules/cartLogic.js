// modules/cartLogic.js
const { v4: uuidv4 } = require('uuid');

function addItemToCart(cart, newItem) {
    const itemsList = cart.cartItems ? [...cart.cartItems] : [];
    itemsList.push(newItem);
    cart.cartItems = itemsList;
}

function handleCart(request, response) {
    const newItem = request.body;
    let cart = request.cookies.cart || {};

    if (cart === request.cookies.cart) {
        addItemToCart(cart, newItem);
    } else {
        cart = {
            cartId: uuidv4(),
            userID: "guest: " + uuidv4(),
            timestamp: new Date().getTime(),
            cartItems: [newItem]
        };
    }

    console.log(cart);
    response.cookie('cart', cart, { maxAge: 3600000 })
        .status(200).send("Item added to cart.");
}

module.exports = {
    addItemToCart,
    handleCart
};



