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

const app = express();

app.set('view engine', 'ejs');
// app.use(session({ secret : process.env.SECRET }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// SQL connection funtion
const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'babygrandad',
    password: 'SimpleDBPass@1',
    database: 'fullstack_ostore'
});

// Listen for the Node.js process to exit
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
    res.render('home',{pageTitle : "Home"})
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
    res.render('products',{pageTitle : "Shop"})
});

app.route('/product')
.get((req,res)=>{
    res.render('product',{pageTitle : "product"})
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
        const sql = `
        SELECT
  products.product_id,
  products.product_name,
  products.product_discription,
  products.price,
  products.quantity,
  (
    SELECT JSON_ARRAYAGG(sizes.size)
    FROM product_sizes
    LEFT JOIN sizes ON product_sizes.size_id = sizes.size_id
    WHERE product_sizes.product_id = products.product_id
  ) AS sizes,
  (
    SELECT JSON_ARRAYAGG(genders.gender)
    FROM product_genders
    LEFT JOIN genders ON product_genders.gender_id = genders.gender_id
    WHERE product_genders.product_id = products.product_id
  ) AS genders,
  (
    SELECT JSON_ARRAYAGG(JSON_OBJECT('color_name', colors.color_name, 'color_hex', colors.color_hex))
    FROM product_colors
    LEFT JOIN colors ON product_colors.color_id = colors.color_id
    WHERE product_colors.product_id = products.product_id
  ) AS colors,
  (
    SELECT JSON_ARRAYAGG(categories.category_name)
    FROM product_categories
    LEFT JOIN categories ON product_categories.category_id = categories.category_id
    WHERE product_categories.product_id = products.product_id
  ) AS categories
FROM
  products
GROUP BY
  products.product_id,
  products.product_name,
  products.product_discription,
  products.price,
  products.quantity;

  `;
        connection.query(sql, (error, results, fields) => {
            if (error) throw error;
            console.log(results);
            res.send(results); // send the results back to the client
        });
    });



app.listen(3000, function() {
    console.log("Server started on port 3000");
});