const express = require('express');
const app = express(); // our app
const PORT = process.env.PORT || 4000;
const methodOverride = require('method-override');
const axios = require('axios'); // access data from an api
const dotenv = require('dotenv'); // remember: this is managing environment variables
dotenv.config();
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport-config');
const isLoggedIn = require('./middleware/isLoggedIn');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BensonBBQ');
const SECRET_SESSION = process.env.SECRET_SESSION;


// ------------ DATA -----------------
const { User } = require('./models');
const meat = require('./models/meats'); 
const side = require('./models/sides');
const drink = require('./models/drinks');
const Order = require('./models/order')

// ------------ MIDDLEWARE ------------
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// initial passport
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next(); // going to said route
});

// import auth routes
app.use('/auth', require('./controllers/auth'));

// --- AUTHENTICATED ROUTE: go to user profile page --- 
app.get('/profile', isLoggedIn, (req, res) => {
    const { name, email, phone } = req.user;
    res.render('profile', { name, email, phone });
});


// --------- DATA ----------
// ------------- DATA ---------
// const {meats} = require("./models/meats");
// const {sides} = require("./models/sides");
// const {drinks} = require("./models/drinks");

// console.log(drinks);
// console.log(meats);

// -------- GET ROUTES -------------
// -------- HOME ----------
// app.get('/', (req, res) => {
//     res.render('index', {});
// });

app.get('/', (req,res) => {
    axios
        .get("https://api.unsplash.com/photos/random", {
            headers: {
                Authorization:"Client-ID " + process.env.UNSPLASH_ACCESS_KEY,
            },
        })
        .then((response) => {
            console.log(response.data.urls.raw);

                res.render("index", {picture: response.data.urls.raw});
        });
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
    const existingOrder = await Order.findOne();
    res.render('order/index', {existingOrder,allDrinks, allSides, allMeats});
});

//------- STATUS ----------
app.get('/status', async (req, res) => {
    const existingOrder = await Order.findOne();
    console.log('Existing Order:---get /status', existingOrder);
    const allMeats = await meat.find();
    const allSides = await side.find();
    const allDrinks = await drink.find();
    
    res.render('status/index', {existingOrder, allDrinks, allSides, allMeats});
});

app.get('/cart', async (req, res) => {
    let existingOrder = await Order.find();
    console.log('Existing Order:---get /cart', existingOrder);
    const allMeats = await meat.find();
    const allSides = await side.find();
    const allDrinks = await drink.find();
    res.render('checkout/index', {existingOrder,allDrinks, allSides, allMeats});
});

app.post('/add-to-cart', async (req, res) => {
    console.log('add to cart post route');
    try {
        console.log('found one');
        let { name, price } = req.body;
        let parsedPrice = parseFloat(price);
        let existingOrder = await Order.findOne(); 
        let idNum = Math.floor(Math.random() * 300);

        if (!existingOrder) {
            console.log('creating order');
            existingOrder = await Order.create({
                id: idNum.toString(),
                items: [],
                submitted: false,
                totalPrice: 0, 
                completed: false,
            });
        }

     
        existingOrder.items.push({ name, price: parsedPrice, quantity: 1 });

        
        existingOrder.totalPrice += parsedPrice;
        console.log('Existing order items:', existingOrder.items);
      
        await existingOrder.save(); 

        console.log('Existing Order:', existingOrder);
        res.redirect('/order'); 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/checkout', async (req, res) => {
    try {
        const { name, totalPrice } = req.body;
        // const totalPrice = parseFloat(price);
        
        let existingOrder = await Order.findOne();
        let idNum = Math.floor(Math.random() * 300);

        existingOrder.items.push({ name, totalPrice, quantity: 1 });
        existingOrder.totalPrice += totalPrice;
        existingOrder.submitted = true;
        let count = 60;
        const timer = setInterval(function() {
            count--;
            console.log(count);
            if (count === 0) {
                clearInterval(timer);
                console.log("Time's up!");
                existingOrder.completed = true;
                console.log('------ STATUS ---------', existingOrder)
            }
        }, 1000);
        
      
        await existingOrder.save();

        let newOrder = await Order.create({
            id: idNum.toString(),
            items: [],
            submitted: false,
            totalPrice: 0,
            completed: false,
        });

        
        // Sort documents by timestamp in descending order and limit to 1
        const latestRecord = await Order.findOne({totalPrice: '0'});
        console.log('Existing Order:', existingOrder);
        console.log('New Order:', latestRecord)
        res.redirect('/status');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// ------- CHECKOUT ----------


Order.collection.countDocuments({} , (err , data)=> {
    if ( err ) console.log( err.message );
     console.log ( `There are ${data} orders in this database` );
 });

 app.put('/cart', async (req, res) => {
    console.log('add 1 put route');
    console.log('----------Update Quantity-------\n', req.body);
    try {
        console.log('found one');
        let { name, quantity } = req.body;
        let parsedquantity = parseInt(quantity);
        //let parsedPrice = parseFloat(price);
        let existingOrder = await Order.findOne({submitted: false});

        if (existingOrder) {
            const item = existingOrder.items.find(item => item.name === name)
            //const totalPrice = existingOrder.totalPrice
            if (item) {
                item.quantity += parsedquantity;
                //totalPrice += parsedPrice;
                await existingOrder.save();
                console.log('------Updated Order-----', existingOrder)
            } else {
                console.error('Item not found in order')
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    res.redirect('/cart');
});

app.put('/status', async (req, res) => {
    console.log('add 1 put route');
    console.log('----------Update Quantity-------\n', req.body);
    try {
        console.log('found one');
        let { name, quantity } = req.body;
        let parsedquantity = parseInt(quantity);
        //let parsedPrice = parseFloat(price);
        let existingOrder = await Order.findOne({submitted: false});

        if (existingOrder) {
            const item = existingOrder.items.find(item => item.name === name)
            //const totalPrice = existingOrder.totalPrice
            if (item) {
                item.quantity += parsedquantity;
                //totalPrice += parsedPrice;
                await existingOrder.save();
                console.log('------Updated Order-----', existingOrder)
            } else {
                console.error('Item not found in order')
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    res.redirect('/status');
});



//  app.delete('/cart/:orderId', async (req,res) => {
    
//        try{
//         let { orderId } = req.params;
//         let { itemId } = req.body;
//         const updatedOrder = await Order.findOneAndUpdate(
//             { id: orderId },
//             { $pull: { items: { _id: itemId } } }, // Removes the item with the matching _id
//             { new: true } 
//         );

//         if (!updatedOrder) {
//             console.error('Order Not Found');
//             return res.redirect('/cart');
//         } else {
//             console.log('-----Item Deleted ----')
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
//     res.redirect('/cart')
// });

app.delete('/cart/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { itemId } = req.body;
        const existingOrder = await Order.findOne({ id: orderId });
        if (!existingOrder) {
            console.error('Order Not Found');
            return res.redirect('/cart');
        } else {
          existingOrder.items.pull({ _id: itemId }); // Remove the item with the specified _id
            await existingOrder.save();
            console.log('-----Item Deleted ----', itemId);
            //console.log('Updated Order:', existingOrder);
            res.redirect('/cart');  
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});







app.listen(PORT, () => {
    console.log('🎧 Server is running on PORT 🎧', PORT);
});
