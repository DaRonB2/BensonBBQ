const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BensonBBQ');
// ------------ DATA -----------------
const meat = require('./models/meats'); 
const side = require('./models/sides');
const drink = require('./models/drinks');

const meat1 = allMeats[0];
const meat2 = allMeats[1];
const meat3 = allMeats[2];
const side1 = allSides[0];
const side2 = allSides[1];
const side3 = allSides[2];
const drink1 = allDrinks[0];
const drink2 = allDrinks[1];
const drink3 = allDrinks[2];
const button1 = document.getElementById('button1');
console.log(button1);
console.log(meat1);

button1.addEventListener('click', () => {
    console.log('button was clicked');
})
