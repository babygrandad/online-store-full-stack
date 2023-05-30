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

app.route('/product')
.get((req,res)=>{

    let requestedShoe = 18;

    const sql = `SELECT * from all_shoes WHERE product_id =`+ requestedShoe + ` ;`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        
        res.render('product',{pageTitle : "product" , shoe : results}); // send the results back to the client
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

app.listen(3000, function() {
    console.log("Server started on port 3000");
});