//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios =  require("axios");
const _ = require('lodash');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require ('path');
const $ = require ('jquery');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.set('view engine', 'ejs');
// app.use(session({ secret : process.env.SECRET }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Configure passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      connection.query(
        'SELECT * FROM customers WHERE email = ?',
        [email],
        (error, results) => {
          if (error) {
            console.log(error);
            return done(error);
          }
  
          if (results.length === 0) {
            return done(null, false, { message: 'Invalid email or password' });
          }
  
          const user = results[0];
  
          // Compare the provided password with the hashed password stored in the database
          bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err) {
              console.log(err);
              return done(err);
            }
  
            if (!passwordMatch) {
              return done(null, false, { message: 'Invalid email or password' });
            }
  
            // Login successful
            return done(null, user);
          });
        }
      );
    }
  )
);

//User session tracking initialize.
app.use(session(
    {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MySQLStore({
        // Configure your session store options
        // For example, provide your MySQL database connection details
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
      }),
    })
);




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


//Bootstrap pointers for offline use.
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));


app.route('/')
.get((req,res)=>{

    const sql = `SELECT * from all_shoes;`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        
    res.render('home',{pageTitle : "Home",  results : results}); // send the results back to the client
    });
});

app.route('/contact')
.get((req,res)=>{
    res.render('contact',{pageTitle : "Contact"})
});

app.route('/about')
.get((req,res)=>{
    res.render('about',{pageTitle : "about"})
});


// Product pages routse
app.route('/products')
.get((req,res)=>{

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
                    groupColorResults : groupColorResults
                });
            });
        });
    });
});

app.route('/products/:shoeID')
.get((req,res)=>{

    let requestedShoe = req.params.shoeID;

    const sql = `SELECT * from all_shoes WHERE product_id =`+ requestedShoe + ` ;`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        
        res.render('product',{pageTitle : results[0].product_name , shoe : results}); // send the results back to the client
    });
});

app.route('/categories')
.get((req,res)=>{
    res.render('categories',{pageTitle : "categories"})
});


//sign up routes
app.route('/signup')
.get((req,res)=>{
    res.render('signup',{pageTitle : "signup"})
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
.get((req,res)=>{
    res.render('login',{pageTitle : "login"})
})
.post(
  passport.authenticate('local', {
    successRedirect: '/products', // Redirect to the products page upon successful login
    failureRedirect: '/login', // Redirect back to the login page if authentication fails
  })
);



app.route('/test')
.get((req,res)=>{

    const sql = `SELECT * from all_shoes;`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        
    res.send(results); // send the results back to the client
    });
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});