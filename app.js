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
  let newItem = { color, size, quantity, productID, entryID } = req.body;

  function newCartToDB(connection, cart, res) {
    const { cartID, userID, created, updated } = cart;

    connection.query(
      'INSERT INTO carts (cart_id, user_id, created, modified) VALUES (?,?,?,?)',
      [cartID, userID, created, updated],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error saving cart. Please try again");
          return;
        }
        // Registration successful
        responseWithCookie(res, cart, "Guest shopper");
      }
    );
  }

  function updateModifedInDB(connection, cart, res) {
    const { cartID, updated } = cart;

    connection.query(
      'UPDATE carts SET modified = ? WHERE cart_id = ?',
      [updated, cartID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error saving cart. Please try again");
          return;
        }
        // Registration successful
        responseWithCookie(res, cart, "Guest shopper");
      }
    );
  }

  function updateUserIDandModifedInDB(connection, cart, res) {
    const { cartID, userID, updated } = cart;

    connection.query(
      'UPDATE carts SET user_id = ?, modified = ? WHERE cart_id = ?',
      [userID, updated, cartID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error saving cart. Please try again");
          return;
        }
        // Registration successful
        responseWithCookie(res, cart, "Guest shopper");
      }
    );
  }

  function newCartForAuthUser() {
    let timestamp = new Date().getTime()
    let cart = {}
    cart.cartID = uuidv4();
    cart.userID = req.user.email;
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
  }

  function newCartForGuest() {
    let timestamp = new Date().getTime()
    let cart = {}
    cart.cartID = uuidv4();
    cart.userID = 'Guest : ' + uuidv4();
    cart.created = timestamp;
    cart.updated = timestamp;
    return cart;
  }

  function responseWithCookie(res, cart, user) {
    res.cookie('cart', cart, { maxAge: 3600000 })
      .status(200).send(`Cart saved for ${user}.`)
  }

  if (req.isAuthenticated()) {
    //scinario 1. User Makes a Cart as Guest and Then Logs In:
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;

      //check who the cart belongs to.

      if (userID.startsWith('Guest :')) {//if cart belongs to guest 
        cart.userID = req.user.email
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateUserIDandModifedInDB(connection, cart, res); //update userID & modified in DB
      }
      else if (userID === req.user.email) {//if cart belongs to this user 
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateModifedInDB(connection, cart, res); //Only update the modified field in DB

      }
      else {//if cart belongs to another user
        let cart = newCartForAuthUser();
        //rest of code
        console.log(cart)
        newCartToDB(connection, cart, res); // Add a brand new cart to the DB
      }
    }
    else {// Scinario 2. Logged-In User Creates a Cart:

      let cart = newCartForAuthUser();
      console.log(cart);
      // send response
      newCartToDB(connection, cart, res); // Add a brand new cart to the DB
    }
  }
  else {
    if (req.cookies.cart) {
      const cart = req.cookies.cart;
      const userID = cart.userID;
      
      //Check who the cart belongs to

      if (userID.startsWith('Guest :')) {//if cart belongs belongs to a guest
        cart.updated = new Date().getTime();
        //rest of code

        console.log(cart);
        // send response
        updateModifedInDB(connection, cart, res); //Only update the modified field in DB

      } 
      else {//if cart belongs to a user
        let cart = newCartForGuest();

        console.log(cart);
        // send cart to bd
        newCartToDB(connection, cart, res); // Add a brand new cart to the DB
      }

    }
    else { // Unregistared user creates a new cart
      let cart = newCartForGuest();
      //rest of code
      newItem.cartID = cart.cartID

      console.log(cart);
      //Put cart into DB
      newCartToDB(connection, cart, res); // Add a brand new cart to the DB
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
     // Authenticate using the LocalStrategy we defined earlier
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // If authentication fails, return the error message
      console.log(info)
      return res.status(401).json({ message: info.message });
    }

    // If authentication succeeds, log the user in using req.login()
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      // Return a success message or the user object
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
  });

//Testing Routes
app.route('/test')
  .get((req, res) => {
    if (req.isAuthenticated()){
      res.render('test', { pageTitle: "Successful Login" })
    }else{
      res.redirect('/login');
    }
  });


app.listen(3000, function () {
  console.log("Server started on port 3000 on " + new Date());
});