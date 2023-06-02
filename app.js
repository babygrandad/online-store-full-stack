//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios =  require("axios");
const _ = require('lodash');
const mysql = require('mysql2');
const session = require('express-session');
const path = require ('path');
const $ = require ('jquery');


const app = express();

app.set('view engine', 'ejs');
// app.use(session({ secret : process.env.SECRET }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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


//temporary bootstrap points for offlne use
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

app.route('/products')
.get((req,res)=>{

    const sql = `SELECT * from all_shoes ;`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;

        res.render('products',{pageTitle : "Shop", results : results}); // send the results back to the client
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

app.route('/signup')
.get((req,res)=>{
    res.render('signup',{pageTitle : "signup"})
});

app.route('/login')
.get((req,res)=>{
    res.render('login',{pageTitle : "login"})
});

app.route('/test')
.get((req,res)=>{

    const sql = `SELECT * from all_shoes;`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        
    res.send(results); // send the results back to the client
    });
});


//server stay alive (*&%*&$^&%$(&^$&^%(*&%$*^&%$^%$(*&%^%*&%*&^$(^^&%&^%(&%^%(*&%(&%^%$*^$*^$*^&$^&))))))))
let intervalId = null;

app.get('/ping', (req, res) => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      axios.get('https://online-store-oxhj.onrender.com/ping' ||'http://localhost:3000/ping') // Replace with your server address
        .then(() => {
          console.log('Server pinged successfully.');
        })
        .catch((error) => {
          console.error('Error pinging server:', error);
        });
    }, 870000); // Set the interval to 14 minutes and 30 seconds (870000 milliseconds)
  }

  // Send a response to indicate that the interval is set or already active
  res.json('Ping interval set or already active');
});

// Optional: Clear the interval when the server is shutting down
// process.on('SIGINT', () => {
//   if (intervalId) {
//     clearInterval(intervalId);
//     console.log('Ping interval cleared.');
//   }
//   process.exit();
// });
//server stay alive (*&%*&$^&%$(&^$&^%(*&%$*^&%$^%$(*&%^%*&%*&^$(^^&%&^%(&%^%(*&%(&%^%$*^$*^$*^&$^&))))))))


app.listen(3000, function() {
    console.log("Server started on port 3000");
});