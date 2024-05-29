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


// -------- GET ROUTES -------------
// -------- HOME ----------
app.get('/', (req, res) => {
    // send array as a response
    res.render('index', {});
});

// ------ MENU -----------
app.get('/menu', (req, res) => {
    // send array as a response
    res.render('menu/index', {});
});




app.listen(PORT, () => {
    console.log('🎧 Server is running on PORT 🎧', PORT);
});