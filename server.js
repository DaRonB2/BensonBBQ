const express = require('express');
const app = express(); // our app
const PORT = process.env.PORT || 4000;
const methodOverride = require('method-override');
const axios = require('axios'); // access data from an api
const dotenv = require('dotenv'); // remember: this is managing environment variables
dotenv.config();


// ------------ MIDDLEWARE ------------
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------- DATA ----------
// ------------- DATA ---------
const {meats} = require("./models/meats");
const {sides} = require("./models/sides");
const {drinks} = require("./models/drinks");

console.log(drinks);
console.log(meats);



// -------- GET ROUTES -------------
// -------- HOME ----------
app.get('/', (req, res) => {
    res.render('index', {});
});

// ------ MENU -----------
app.get('/menu', (req, res) => {
    res.render('menu/index', {});
});

app.get('/menu/meats', (req,res) => {
    res.render('menu/meat', {});
});

app.get('/menu/drinks', (req,res) => {
    res.render('menu/drinks', {});
});

app.get('/menu/sides', (req,res) => {
    res.render('menu/sides', {});
});

// ------- ORDER ---------
app.get('/order', (req, res) => {
    res.render('order/index', {});
});

//------- STATUS ----------
app.get('/status', (req, res) => {
    res.render('status/index', {});
});





app.listen(PORT, () => {
    console.log('🎧 Server is running on PORT 🎧', PORT);
});