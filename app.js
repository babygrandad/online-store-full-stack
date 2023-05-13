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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
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
        let sql = "SELECT JSON_OBJECT(\n" +
        "    'product_name', products.product_name,\n" +
        "    'sizes', JSON_ARRAYAGG(sizes.size)\n" +
        ") AS result\n" +
        "FROM products\n" +
        "LEFT JOIN product_sizes ON products.product_id = product_sizes.product_id\n" +
        "LEFT JOIN sizes ON product_sizes.size_id = sizes.size_id\n" +
        "GROUP BY products.product_id;";

        connection.query(sql, (error, results, fields) => {
            if (error) throw error;
            console.log(results);
            res.send(results); // send the results back to the client
        });
    });



app.listen(3000, function() {
    console.log("Server started on port 3000");
});