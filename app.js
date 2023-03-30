//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios =  require("axios");
const _ = require('lodash');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
// app.use(session({ secret : process.env.SECRET }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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


app.listen(3000, function() {
    console.log("Server started on port 3000");
});