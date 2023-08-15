const { v4: uuidv4 } = require('uuid');

// Function to add items to the database
function addItemsToDB(newItem, callback) {
   const { color, size, quantity, productID, entryID } = newItem;
   const sql = 'INSERT INTO cart_items (entry_id, cart_id, product_id, color, size, quantity) VALUES (?, ?, ?, ?, ?, ?)';
   const values = [entryID, cartID, productID, color, size, quantity];
 
   connection.query(sql, values, (error, results) => {
     if (error) {
       console.error('Error storing item:', error);
       callback(error);
       return;
     }
     callback(null, results);
   });
 }

// Function to add a cart to the database
function addCartToDB(cart, callback) {
   const sql = 'INSERT INTO carts (cart_id, user_id, timestamp) VALUES (?, ?, ?)';
   const values = [cart.cartId, cart.userID, cart.timestamp];
 
   connection.query(sql, values, (error, results) => {
     if (error) {
       console.error('Error storing cart:', error);
       callback(error);
       return;
     }
     callback(null, results);
   });
 }

// Function to to execute in the .post('cart/add') route
function handleCart(request,response){
   const newItem = request.body;
   const { color, size, quantity, productID, entryID } = newItem;
   const userID = request.isAuthenticated() ? request.user.email : 'guest: ' + uuidv4();
 
   if (request.cookies.cart) {
     const cartID = request.cookies.cart.cartId;
     const cart = { cartId: cartID, userID, timestamp: new Date().getTime() };
 
     addItemsToDB(newItem, (error) => {
       if (error) {
         response.status(500).send('Error storing item.');
         return;
       }
       response.status(200).send('Item added to cart.').cookie('cart', cart, { maxAge: 3600000 });
     });
   } else {
     const cart = { cartId: uuidv4(), userID, timestamp: new Date().getTime() };
 
     addCartToDB(cart, (error) => {
       if (error) {
         response.status(500).send('Error storing cart.');
         return;
       }
 
       addItemsToDB(newItem, (error) => {
         if (error) {
           response.status(500).send('Error storing item.');
           return;
         }
         response.status(200).send('Item added to cart.').cookie('cart', cart, { maxAge: 3600000 });
       });
     });
   }
}

module.exports = {
   addCartToDB,
   addItemsToDB,
   handleCart
};