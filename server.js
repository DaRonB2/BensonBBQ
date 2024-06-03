const express = require('express');
const app = express(); // our app
const PORT = process.env.PORT || 4000;
const methodOverride = require('method-override');
const axios = require('axios'); // access data from an api
const dotenv = require('dotenv'); // remember: this is managing environment variables
dotenv.config();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BensonBBQ');
// ------------ DATA -----------------
const meat = require('./models/meats'); 
const side = require('./models/sides');
const drink = require('./models/drinks');

// ------------ MIDDLEWARE ------------
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------- DATA ----------
// ------------- DATA ---------
// const {meats} = require("./models/meats");
// const {sides} = require("./models/sides");
// const {drinks} = require("./models/drinks");

// console.log(drinks);
// console.log(meats);

// -------- GET ROUTES -------------
// -------- HOME ----------
app.get('/', (req, res) => {
    res.render('index', {});
});

// ------ MENU -----------
app.get('/menu', async (req, res) => {
    const allMeats = await meat.find();
    const allSides = await side.find();
    const allDrinks = await drink.find();
    res.render('menu/index', {allDrinks, allSides, allMeats});
});


app.get('/menu/meats', async (req, res) => {
    try {
        const allMeats = await meat.find(); // Fetch all meats from MongoDB
        res.render('menu/meat', { allMeats });
    } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>');
    }
});

app.get('/menu/sides', async (req, res) => {
    try {
        const allSides = await side.find(); // Fetch all meats from MongoDB
        res.render('menu/sides', { allSides });
    } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>');
    }
});

app.get('/menu/drinks', async (req, res) => {
    try {
        const allDrinks = await drink.find(); // Fetch all meats from MongoDB
        res.render('menu/drinks', { allDrinks });
    } catch (error) {
        res.status(404).send('<h1>404! Page Not Found.</h1>');
    }
});

// ------- ORDER ---------
app.get('/order', async (req, res) => {
    const allMeats = await meat.find();
    const allSides = await side.find();
    const allDrinks = await drink.find();
    res.render('order/index', {allDrinks, allSides, allMeats});
});

//------- STATUS ----------
app.get('/status', (req, res) => {
    res.render('status/index', {});
});





app.listen(PORT, () => {
    console.log('🎧 Server is running on PORT 🎧', PORT);
});
