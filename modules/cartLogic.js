// modules/cartLogic.js
const uuidv4 = require('uuid/v4');

function addItemToCart(cart, newItem) {
    const itemsList = cart.cartItems ? [...cart.cartItems] : [];
    itemsList.push(newItem);
    cart.cartItems = itemsList;
}

function handleCart(request, response) {
    const newItem = req.body;
    let cart = req.cookies.cart || {};

    if (cart === req.cookies.cart) {
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
    res.cookie('cart', cart, { maxAge: 3600000 })
        .status(200).send("Item added to cart.");
}

module.exports = {
    addItemToCart,
    handleCart
};
