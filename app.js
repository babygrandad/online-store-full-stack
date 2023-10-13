//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const _ = require('lodash');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
//User session tracking initialize.
app.use(session(
  {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }),
);
// Initialize Passport and session support
app.use(passport.initialize());
app.use(passport.session());


// SQL connection funtion
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});
// Listen for the Node.js process to exit (related to SQL connection)
process.on('exit', () => {
  // Close the MySQL connection
  connection.end();
});


// Passport configuration
passport.use(new LocalStrategy({
  usernameField: 'email', // Specify the field used for the email
}, (email, password, done) => {
  // Find the user with the given email in the database
  connection.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
    if (error) {
      return done(error);
    }
    if (!results.length) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    const user = results[0];
    // Compare the hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      return done(null, user);
    });
  });
}));

// Serialize and Deserialize User (required for session support)
passport.serializeUser((user, done) => {
  done(null, user.customer_id);
});

passport.deserializeUser((id, done) => {
  connection.query('SELECT * FROM customers WHERE customer_id = ?', [id], (error, results) => {
    done(error, results[0]);
  });
})


//Bootstrap pointers for offline use.
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));


app.route('/')
  .get((req, res) => {

    const sql = `SELECT * from all_shoes;`;
    connection.query(sql, (error, results, fields) => {
      if (error) throw error;

      res.render('home', { pageTitle: "Home", results: results, isLoggedIn : req.isAuthenticated() }); // send the results back to the client
    });
  });

app.route('/contact')
  .get((req, res) => {
    res.render('contact', { pageTitle: "Contact", isLoggedIn : req.isAuthenticated() })
  });

app.route('/about')
  .get((req, res) => {
    res.render('about', { pageTitle: "about", isLoggedIn : req.isAuthenticated() })
  });


// Product pages routse
app.route('/products')
  .get((req, res) => {

    const allShoesSql = `SELECT * FROM all_shoes;`;
    const categorySql = `SELECT category_name FROM categories;`;
    const groupColorSql = `SELECT * FROM group_colors;`;

    connection.query(allShoesSql, (error, results, fields) => {
      if (error) throw error;

      connection.query(categorySql, (categoryError, categoryResults, categoryFields) => {
        if (categoryError) throw categoryError;

        connection.query(groupColorSql, (groupColorError, groupColorResults, groupColorFields) => {
          if (groupColorError) throw groupColorError;

          res.render('products', {
            pageTitle: "Shop",
            results: results,
            categoryResults: categoryResults,
            groupColorResults: groupColorResults,
            isLoggedIn : req.isAuthenticated()
          });
        });
      });
    });
  });

app.route('/products/:shoeID')
  .get((req, res) => {

    let requestedShoe = req.params.shoeID;

    const sql = `SELECT * from all_shoes WHERE product_id =` + requestedShoe + ` ;`;
    connection.query(sql, (error, results, fields) => {
      if (error) throw error;

      res.render('product', { pageTitle: results[0].product_name, shoe: results, isLoggedIn : req.isAuthenticated() }); // send the results back to the client
    });
  });

//Cart routes 
app.route('/cart')
  .get((req, res) => {

    if(req.cookies.cart){
      const {cartID, userID, created, updated} = req.cookies.cart;

      const selectSQl = (`SELECT * FROM cart_info WHERE cart_id = "` + cartID + `" ;`);

      const successMessage = req.query.successMessage;

      connection.query(selectSQl, (error, results, fields) => {
        if (error) throw error;
  
        res.render('cart', { pageTitle: "Cart", results: results, isLoggedIn : req.isAuthenticated(), successMessage }); // send the results back to the client
      })
    }else{
      let results = []
      res.render('cart', { pageTitle: "Cart", results: results, isLoggedIn : req.isAuthenticated() });
    }
    
  });

app.route('/cart/add')
  .post((req, res) => {
    if (req.isAuthenticated()) { //Is the user logged in? - Yes

      // There is a cart already so.
      let cart = req.cookies.cart;
      updateAuthCartInDB(req, res, cart, connection)

    } else { // is the user logged in? - No

      if (req.cookies.cart) { // is there a cart in the browser? - Yes
        let cart = req.cookies.cart;
        let userID = cart.userID;

        if (userID.startsWith("Guest :")) { // is it a guest cart? - Yes

          cart.updated = new Date().getTime();
          updateGuestCartInDB(req, res, cart, connection);
        } else {// is it guest cart? - no

          let cart = newCartForGuest();
          newCartToDB(req, res, cart, connection)
        }
      } else { // is there a cart in the browser? - No

        let cart = newCartForGuest();
        newCartToDB(req, res, cart, connection)
      }
    }

    function newCartForGuest() {
      let timestamp = new Date().getTime();
      let cart = {};
      cart.cartID = uuidv4();
      cart.userID = "Guest : " + uuidv4();
      cart.created = timestamp;
      cart.updated = timestamp;
      return cart;
    }
    async function newCartToDB(req, res, cart, connection) {
      try {
        const { cartID, userID, created, updated } = cart;

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)";
        const insertCartValues = [cartID, userID, created, updated];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        try {
          const CartSumQuantity = await getCartSumQuantity(cartID, connection);
          cart.sumQuantity = CartSumQuantity;
        } catch (error) {
          console.error('Error:', error);
        }

        function determineUser() {
          if (userID.startsWith("Guest :")) {
            return "Guest User";
          } else {
            return userID;
          }
        }

        //testing cart results
        console.log(cart);

        // Handle response here
        res
          .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
          .status(200)
          .send(`Cart saved for ${determineUser()}.`);
      } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again.");
      }
    }
    async function updateGuestCartInDB(req, res, cart, connection) {
      try {
        const { cartID } = cart;
        const newUpdate = getNewTime()
        // SQL query 1 (using promise-based API)
        const insertCartQuery = "UPDATE carts SET modified = ? WHERE cart_id = ?";
        const insertCartValues = [newUpdate, cartID];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);


        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        try {
          const CartSumQuantity = await getCartSumQuantity(cartID, connection);
          cart.sumQuantity = CartSumQuantity;
          cart.updated = newUpdate;
        } catch (error) {
          console.error('Error:', error);
        }

        //testing cart results
        console.log(cart);

        // Handle response here
        res
          .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
          .status(200)
          .send(`Cart saved for Guest.`);
      } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again");
      }
    }
    async function updateAuthCartInDB(req, res, cart, connection) {
      try {
        const { userID, cartID } = cart;
        const newUpdate = getNewTime()
        // SQL query 1 (using promise-based API)
        const insertCartQuery = "UPDATE carts SET modified = ? WHERE cart_id = ?";
        const insertCartValues = [newUpdate, cartID];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        try {
          const CartSumQuantity = await getCartSumQuantity(cartID, connection);
          cart.sumQuantity = CartSumQuantity;
          cart.updated = newUpdate;
        } catch (error) {
          console.error('Error:', error);
        }

        //testing cart results
        console.log(cart);

        // Handle response here
        res
          .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
          .status(200)
          .send(`Cart saved for ${userID}.`);
      } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again");
      }
    }
  });

app.route('/cart/remove')
  .delete((req, res) => {
    const { productId, entryId } = req.body;
    const cart = req.cookies.cart;

    // Delete item from the cart
    const deleteSql = 'DELETE FROM cart_items WHERE product_id = ? AND entry_id = ?';
    const deleteValues = [productId, entryId];

    connection.query(deleteSql, deleteValues, (deleteError, deleteResults, deleteFields) => {
      if (deleteError) {
        console.error(deleteError);
        return res.status(500).json({ error: 'Database error' });
      }

      // After successful deletion, update the 'modified' timestamp in the 'carts' table
      const updateModifiedSql = 'UPDATE carts SET modified = ? WHERE cart_id = ?';
      const currentTime = new Date().getTime(); // Get current timestamp
      const updateModifiedValues = [currentTime, cart.cartID]; // You need to define 'cartId'

      connection.query(updateModifiedSql, updateModifiedValues, (updateError, updateResults, updateFields) => {
        if (updateError) {
          console.error(updateError);
          return res.status(500).json({ error: 'Database error' });
        }

        // Calculate the total quantity in 'cart_items' for the specific 'cart_id'
        const calculateTotalQuantitySql = 'SELECT SUM(quantity) AS count_value FROM cart_items WHERE cart_id = ?';
        const calculateTotalQuantityValues = [cart.cartID]; // You need to define 'cartId'

        connection.query(calculateTotalQuantitySql, calculateTotalQuantityValues, (calculateTotalQuantityError, calculateTotalQuantityResults) => {
          if (calculateTotalQuantityError) {
            console.error(calculateTotalQuantityError);
            return res.status(500).json({ error: 'Database error' });
          }

          cart.updated = currentTime;
          cart.sumQuantity = calculateTotalQuantityResults[0].count_value;

          // Update the cart in the cookie with the updated total quantity
          console.log(cart);

          // Respond with a success message indicating the item removal, 'modified' update, and total quantity
          return res
            .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
            .status(200)
            .json({ message: 'Item removed from cart, modified timestamp updated, and total quantity calculated successfully' });
        });
      });
    });
  });


app.route('/cart/update')
  .patch((req, res) => {
    const { newQuantity, productId, entryId } = req.body;
    const cart = req.cookies.cart;

    // Start a transaction to ensure all queries succeed or fail together
    connection.beginTransaction(function (beginTransactionErr) {
      if (beginTransactionErr) {
        console.error(beginTransactionErr);
        return res.status(500).json({ error: 'Database error' });
      }

      // Update the quantity in the 'cart_items' table
      const updateQuantitySql = 'UPDATE cart_items SET quantity = ? WHERE product_id = ? AND entry_id = ?';
      const updateQuantityValues = [newQuantity, productId, entryId];

      connection.query(updateQuantitySql, updateQuantityValues, function (updateQuantityErr, updateQuantityResults) {
        if (updateQuantityErr) {
          // Rollback the transaction on error
          connection.rollback(function () {
            console.error(updateQuantityErr);
            return res.status(500).json({ error: 'Database error' });
          });
        } else {
          // Update the 'modified' timestamp in the 'carts' table
          const updateModifiedSql = 'UPDATE carts SET modified = ? WHERE cart_id = ?';
          const currentTime = new Date().getTime();
          const updateModifiedValues = [currentTime, cart.cartID];

          connection.query(updateModifiedSql, updateModifiedValues, function (updateModifiedErr, updateModifiedResults) {
            if (updateModifiedErr) {
              // Rollback the transaction on error
              connection.rollback(function () {
                console.error(updateModifiedErr);
                return res.status(500).json({ error: 'Database error' });
              });
            } else {
              // Execute the SELECT query to calculate the total quantity in 'cart_items'
              const calculateTotalQuantitySql = 'SELECT SUM(quantity) AS count_value FROM cart_items WHERE cart_id = ?';
              const calculateTotalQuantityValues = [cart.cartID];

              connection.query(calculateTotalQuantitySql, calculateTotalQuantityValues, function (calculateTotalQuantityErr, calculateTotalQuantityResults) {
                if (calculateTotalQuantityErr) {
                  // Rollback the transaction on error
                  connection.rollback(function () {
                    console.error(calculateTotalQuantityErr);
                    return res.status(500).json({ error: 'Database error' });
                  });
                } else {
                  // Commit the transaction if all queries are successful
                  connection.commit(function (commitErr) {
                    if (commitErr) {
                      // Rollback the transaction on error
                      connection.rollback(function () {
                        console.error(commitErr);
                        return res.status(500).json({ error: 'Database error' });
                      });
                    } else {
                      // Send a success response with the updated total quantity
                      const totalQuantity = calculateTotalQuantityResults[0].count_value;
                      cart.updated = currentTime;
                      cart.sumQuantity = totalQuantity;
                      console.log(cart);
                      return res
                        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
                        .status(200)
                        .send('Item removed from cart and modified timestamp updated successfully');
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });


app.route('/checkout')
.post((req,res) =>{
  if (req.isAuthenticated()) { //Is the user logged in? - Yes

    // There is a cart already so.
    let cart = req.cookies.cart;
    clearAuthCartInDB(req, res, cart, connection)

  }else{
    res.redirect('/login?loginMessage=You need to login first before making a purchase.')
  }

  async function clearAuthCartInDB(req, res, cart, connection) {
    try {
      const { userID, cartID } = cart;
      const newUpdate = getNewTime()
      // SQL query 1 (using promise-based API)
      const updateCartQuery = "UPDATE carts SET modified = ? WHERE cart_id = ?";
      const updateCartValues = [newUpdate, cartID];
      const [cartResults] = await connection.promise().query(updateCartQuery, updateCartValues);

      // SQL query 2 (using promise-based API)
      const { color, size, quantity, productID, entryID } = req.body;
      const insertItemsQuery = "DELETE FROM cart_items WHERE cart_id = ? ";
      const insertItemsValues = [cartID];
      const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

      try {
        const CartSumQuantity = await getCartSumQuantity(cartID, connection);
        cart.sumQuantity = CartSumQuantity;
        cart.updated = newUpdate;
      } catch (error) {
        console.error('Error:', error);
      }

      //testing cart results
      console.log(cart);

      // Handle response here
      res
        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
        .status(200)
        const message = 'Your order will be delivered in 3 business days.';
        const redirectURL = '/cart?successMessage=' + encodeURIComponent(message);
        res.redirect(redirectURL);

    } catch (error) {
      // Handle any error
      console.error(error);
      res.status(500).send("Error saving cart. Please try again");
    }
  }
})

// -- Global Cart Function
async function getCartSumQuantity(identifier, connection) {
  try {
    const totals = identifier

    const totalsQuery = 'SELECT SUM(quantity) AS count_value FROM cart_items WHERE cart_id = ?';
    const totalsvalue = [totals]
    const [totalsReuslts] = await connection.promise().query(totalsQuery, totalsvalue);

    return totalsReuslts[0].count_value;
  }
  catch (error) {
    throw error;
  }
}

function getNewTime(){
  return new Date().getTime()
}


//sign up routes
app.route('/signup')
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/products')
    } else {
    const errorMessage = req.query.message || '';
    res.render('signup', { pageTitle: 'signup', errorMessage, isLoggedIn : req.isAuthenticated() });
    }
  })
  .post((req, res) => {
    var { fname, lname, email, password, phone } = req.body;
    
    fname = fname.trim();
    lname = lname.trim();
    email = email.trim().toLowerCase();
    password = password.trim();
    phone = phone.replace(/\s/g, "");
    // Check if the email already exists
    connection.query(
      'SELECT * FROM customers WHERE email = ?',
      [email],
      (error, results) => {
        if (error) {
          console.log(error);
          const errorMessage = "Error checking email existence";
          res.render('signup', { pageTitle: 'signup', errorMessage, fname, lname, email, phone });
          return;
        }

        if (results.length > 0) {
          // Email already exists in the database
          const errorMessage = "Email already exists. Please use a different email.";
          console.log(  'Error: ',errorMessage , fname, lname, email, phone );
          res.render('signup', { pageTitle: 'signup', errorMessage, fname, lname, email, phone, statusCode: 409, isLoggedIn : req.isAuthenticated() });
        } else {
          // Email is unique, proceed with user registration
          // Hash the password
          bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
              console.log(err);
              const errorMessage = "Error hashing password";
              res.render('signup', { pageTitle: 'signup', errorMessage, fname, lname, email, phone });
              return;
            }

            // Store the user in the database
            connection.query(
              'INSERT INTO customers (customer_first_name, customer_last_name, email, phone, password) VALUES (?,?,?,?,?)',
              [fname, lname, email, phone, hashedPassword],
              (insertError, insertResults) => {
                if (insertError) {
                  console.log(insertError);
                  const errorMessage = "Error registering user";
                  res.render('signup', { pageTitle: 'signup', errorMessage, fname, lname, email, phone });
                  return;
                }
                const message = "User registered successfully";
                // Registration successful
                res.redirect(`/login?message=${encodeURIComponent(message)}`);
              }
            );
          });
        }
      }
    );
  });



//Login Routes
app.route('/login')
  .get((req, res) => {

    if (req.isAuthenticated()) {
      res.redirect('/products')
    } else {
      res.render('login', { pageTitle: "login", message: req.query.message || '' , isLoggedIn : req.isAuthenticated()})
    }
  })
  .post((req, res, next) => {

    // ! Important ( Moved the functions TO HERE)
    function newCartForAuthUser(user) {
      console.log('Im creating a new cart for the authenticated user.')
      let timestamp = new Date().getTime();
      let cart = {};
      cart.cartID = uuidv4();
      cart.userID = user.email;
      cart.created = timestamp;
      cart.updated = timestamp;
      return cart;
    }
    async function newEmptyCartToDB(res, cart, connection) {
      try {
        const { cartID, userID, created, updated } = cart;

        console.log('I\'m submitting a new empty cart to the DB ')

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)";
        const insertCartValues = [cartID, userID, created, updated];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

        try {
          const CartSumQuantity = await getCartSumQuantity(cartID, connection);
          cart.sumQuantity = CartSumQuantity;
        } catch (error) {
          console.error('Error:', error);
        }

        //testing cart results
        console.log(cart);

        // Handle response here
        res
          .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
          .status(200)
          .send(`Login Successful`);
      } catch (error) {
        // Handle any error
        console.error(error);
        res.status(500).send("Error saving cart. Please try again.");
      }
    }
    async function checkIfCartExistsInDBAlso(res, cart, connection, user) {
      try {
        // SQL query 1 (using promise-based API) - check to see if there's a matching
        // username cart as the logged-in user.
        const checkCartQuery = "SELECT * FROM carts WHERE user_id = ?";
        const [cartResults] = await connection.promise().query(checkCartQuery, [user.email]);
        console.log('I just checked if theres a cart for this user and...')

        //testing cart results
        console.log('cart results -: length = ' + cartResults.length);

        if (cartResults.length === 1) { //does the user have a cart in the DB? - Yes
          console.log('This user has a cart in the DB')
          loginFoundMatchingCart(res, cart, connection, cartResults)
        } else { //does the user have a cart in the DB? - No
          console.log('This user does NOT! have a cart in the db')
          loginDidNotFoundMatchingCart(res, cart, connection, user)
        }
      }
      catch (error) {
        console.error(error);
        res.status(500).send("Error finding cart");
      }
    }
    async function checkIfCartExistsInDB(res, connection, user) {
      try {
        // SQL query 1 (using promise-based API) - check to see if there's a matching
        // username cart as the logged-in user.
        const checkCartQuery = "SELECT * FROM carts WHERE user_id = ?";
        const [cartResults] = await connection.promise().query(checkCartQuery, [user.email]);
        console.log('I just checked if theres a cart for this user and...')

        //testing cart results
        console.log('cart results -: length = ' + cartResults.length);

        if (cartResults.length === 1) { //does the user have a cart in the DB? - Yes
          console.log('This user has a cart in the DB')
          loginFoundExistingCart(res, cartResults)
        } else { //does the user have a cart in the DB? - No
          let cart = newCartForAuthUser(user);
          newEmptyCartToDB(res, cart, connection)
        }
      }
      catch (error) {
        console.error(error);
        res.status(500).send("Error finding cart");
      }
    }
    async function loginFoundMatchingCart(res, cart, connection, cartResults) {
      const { cart_id, user_id } = cartResults[0];
      const { cartID } = cart
      const newUpdate = new Date().getTime();

      console.log('Now im updating the cart items')
      // SQL query 2 (using promise-based API) - update cart_items with the matched cart_id
      const updateCartItemsQuery = "UPDATE cart_items SET cart_id = ? WHERE cart_id = ?";
      const updateCartItemsValues = [cart_id, cartID];
      const [updateResults] = await connection.promise().query(updateCartItemsQuery, updateCartItemsValues);

      console.log('now Im updating the cart')
      // SQL query 3 (using promise-based API) - update the modified timestamp in carts
      const updateCartQuery = "UPDATE carts SET modified = ? WHERE user_id = ?";
      const updateCartValues = [newUpdate, user_id];
      const [updateCartResults] = await connection.promise().query(updateCartQuery, updateCartValues);

      console.log('now Im deleting the guest cart')
      // SQL query 4 (using promise-based API) - update the modified timestamp in carts
      const deleteCartQuery = "Delete FROM carts WHERE cart_id = ?";
      const deleteCartValues = [cartID];
      const [deleteCartResults] = await connection.promise().query(deleteCartQuery, deleteCartValues);

      // Update the cart object with the results and set a cookie
      cart.userID = user_id;
      cart.cartID = cart_id;
      cart.created = cartResults[0].created;
      cart.updated = newUpdate;
      try {
        const CartSumQuantity = await getCartSumQuantity(cart_id, connection);
        cart.sumQuantity = CartSumQuantity;
      } catch (error) {
        console.error('Error:', error);
      }

      //testing cart results
      console.log(cart);

      res
        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
        .status(200)
        .send(`Login Successful`);
    }
    async function loginDidNotFoundMatchingCart(res, cart, connection, user) {
      const { cartID, created } = cart

      const newUpdate = new Date().getTime();

      console.log('now Im updating the cart\'s user_id')
      // SQL query 3 (using promise-based API) - update the modified timestamp in carts
      const updateCartQuery = "UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?";
      const updateCartValues = [user.email, newUpdate, cartID];
      const [updateCartResults] = await connection.promise().query(updateCartQuery, updateCartValues);

      // Update the cart object with the results and set a cookie
      cart.userID = user.email;
      cart.cartID = cartID;
      cart.created = created;
      cart.updated = newUpdate;
      try {
        const CartSumQuantity = await getCartSumQuantity(cartID, connection);
        cart.sumQuantity = CartSumQuantity;
      } catch (error) {
        console.error('Error:', error);
      }

      //testing cart results
      console.log(cart);

      res
        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
        .status(200)
        .send(`Login Successful`);
    }
    async function loginFoundExistingCart(res, cartResults) {
      const { cart_id, user_id, created, modified } = cartResults[0];

      console.log('Now im creating a cookie with this users exiting DB cart')
      // Update the cart object with the results and set a cookie
      let cart = {}
      cart.userID = user_id;
      cart.cartID = cart_id;
      cart.created = created;
      cart.updated = modified;

      try {
        const CartSumQuantity = await getCartSumQuantity(cart_id, connection);
        cart.sumQuantity = CartSumQuantity;
      } catch (error) {
        console.error('Error:', error);
      }

      //testing cart results
      console.log(cart);

      res
        .cookie("cart", cart, { expires: new Date(new Date().getTime() + 3600000) })
        .status(200)
        .send(`Login Successful`);
    }

    // Authenticate using the LocalStrategy we defined earlier
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) { /*If authentication fails, return the error message*/
        console.log(info);
        return res.status(401).json({ message: info.message });
      }

      // If authentication succeeds, log the user in using req.login()
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        if (req.cookies.cart) {// Is there a local cart - Yes
          let cart = req.cookies.cart
          console.log('this user has  local cart')
          if (cart.userID.startsWith("Guest :")) { // does the userID start with Guest? - Yes
            console.log('this users cart starts with "Guest"')
            // check to see if theres a db cart (condition check is in this function)
            checkIfCartExistsInDBAlso(res, cart, connection, user);
          }
          else { // does the userID start with Guest? - No
            console.log('this users cart does not start with guest so im checking if they have a cart in the DB')
            checkIfCartExistsInDB(res, connection, user)
          }

        } else {// Is there a local cart - no
          console.log('This user does not have a local cart')
          checkIfCartExistsInDB(res, connection, user)
        }

        // ! Important ( Moved the functions from here)
      });
    })(req, res, next);
  });

// Logout Route
app.post('/logout', (req, res, next) => {
  console.log(req.user.customer_first_name, req.user.customer_last_name )
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    
    // Clear the 'cart' cookie
    res.clearCookie('cart');
    
    // Redirect the user to the home page after logout
    res.redirect('/login');
  });
});


//Testing Routes
app.route('/test')
  .get((req, res) => {
   res.send()
  });

app.listen(3000, function () {
  console.log("Server started on port 3000 on " + new Date());
});