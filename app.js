//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const axios = require("axios");
const _ = require('lodash');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const $ = require('jquery');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cartLogic = require('./modules/cartLogic');

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

      res.render('home', { pageTitle: "Home", results: results }); // send the results back to the client
    });
  });

app.route('/contact')
  .get((req, res) => {
    res.render('contact', { pageTitle: "Contact" })
  });

app.route('/about')
  .get((req, res) => {
    res.render('about', { pageTitle: "about" })
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
            groupColorResults: groupColorResults
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

      res.render('product', { pageTitle: results[0].product_name, shoe: results }); // send the results back to the client
    });
  });

app.route('/categories')
  .get((req, res) => {
    res.render('categories', { pageTitle: "categories" })
  });


//Cart routes 
app.route('/cart')
  .get((req, res) => {
    res.render('cart', { pageTitle: "cart" })
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
          .cookie("cart", cart, { maxAge: 3600000 })
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
        const { userID, cartID, updated } = cart;

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "UPDATE carts SET modified = ? WHERE cart_id = ?";
        const insertCartValues = [updated, cartID];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);


        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        //testing cart results
        console.log(cart);

        // Handle response here
        res
          .cookie("cart", cart, { maxAge: 3600000 })
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
        const { userID, cartID, updated } = cart;

        // SQL query 1 (using promise-based API)
        const insertCartQuery = "UPDATE carts SET modified = ? WHERE cart_id = ?";
        const insertCartValues = [updated, cartID];
        const [cartResults] = await connection.promise().query(insertCartQuery, insertCartValues);

        // SQL query 2 (using promise-based API)
        const { color, size, quantity, productID, entryID } = req.body;
        const insertItemsQuery = "INSERT INTO cart_items (cart_id, entry_id, product_id, color, size, quantity) VALUES (?,?,?,?,?,?)";
        const insertItemsValues = [cartID, entryID, productID, color, size, quantity];
        const [itemsResults] = await connection.promise().query(insertItemsQuery, insertItemsValues);

        //testing cart results
        console.log(cart);

        // Handle response here
        res
          .cookie("cart", cart, { maxAge: 3600000 })
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
  .post((req, res) => {

    //get and store the object coming from user in a variable

    //get the existing cart from user
    /*if cart exists{
      push the new item into cart
      send the updated cookie back to user
    }
    else{
      create the cart
      push the new item into cart
      send the updated cookie back to user
    }
    
    */


  });



//sign up routes
app.route('/signup')
  .get((req, res) => {
    res.render('signup', { pageTitle: "signup" })
  })
  .post((req, res) => {
    const { fname, lname, email, password, phone } = req.body;

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error hashing password");
        return;
      }

      // Store the user in the database
      connection.query(
        'INSERT INTO customers (customer_first_name, customer_last_name, email, phone, password) VALUES (?,?,?,?,?)',
        [fname, lname, email, phone, hashedPassword],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send("Error registering user");
            return;
          }

          // Registration successful
          res.status(200).send("User registered successfully");
        }
      );
    });
  });


//Login Routes
app.route('/login')
  .get((req, res) => {
    res.render('login', { pageTitle: "login" })
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
        //testing cart results
        console.log(cart);

        // Handle response here
        res
          .cookie("cart", cart, { maxAge: 3600000 })
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
          let cart = newCartForAuthUser();
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

      //testing cart results
      console.log(cart);

      res
        .cookie("cart", cart, { maxAge: 3600000 })
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

      //testing cart results
      console.log(cart);

      res
        .cookie("cart", cart, { maxAge: 3600000 })
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

      //testing cart results
      console.log(cart);

      res
        .cookie("cart", cart, { maxAge: 3600000 })
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
            console.log('this users cart does not start with guest so im deleting it and creating a new one')
            let cart = newCartForAuthUser(user)
            newEmptyCartToDB(res, cart, connection)
          }

        } else {// Is there a local cart - no
          console.log('This user does not have a local cart')
          checkIfCartExistsInDB(res, connection, user)
        }

        // ! Important ( Moved the functions from here)
      });
    })(req, res, next);
  });


//Testing Routes
app.route('/test')
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render('test', { pageTitle: "Successful Login" })
    } else {
      res.redirect('/login');
    }
  });


app.listen(3000, function () {
  console.log("Server started on port 3000 on " + new Date());
});