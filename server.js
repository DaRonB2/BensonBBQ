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
// mongoose.connect('mongodb://localhost/BensonBBQ');
const SECRET_SESSION = process.env.SECRET_SESSION;
// const ejsLint = require('ejs-lint');
// ejsLint(text, options)


// ------------ DATA -----------------
const { User } = require('./models');
const { meat } = require('./models');
const { side } = require('./models');
const { drink } = require('./models');
const { Order } = require('./models');
const { Status } = require('./models');

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

//initial passport
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next(); // going to said route
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


// import auth routes
app.use('/auth', require('./controllers/auth'));

// --- AUTHENTICATED ROUTE: go to user profile page --- 
app.get('/profile', isLoggedIn, (req, res) => {
    const { name, email, phone } = req.user;
    res.render('profile', { name, email, phone });
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
    console.log('Existing Order:---get /order', existingOrder);
    res.render('order/index', {existingOrder,allDrinks, allSides, allMeats});
});

//------- STATUS ----------
app.get('/status', async (req, res) => {
    const existingOrder = await Order.find();
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
        res.redirect('/status');
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
        let { name, quantity, price  } = req.body;
        let parsedquantity = parseInt(quantity);
        let parsedPrice = parseFloat(price);
        let existingOrder = await Order.findOne({submitted: false});

        if (existingOrder) {
            const item = existingOrder.items.find(item => item.name === name)
            let totalPrice = existingOrder.totalPrice
            if (item) {
                item.quantity += parsedquantity;
                totalPrice += parsedPrice;
                existingOrder.totalPrice = 0;
                existingOrder.items.forEach(item => {
                    existingOrder.totalPrice += item.price * item.quantity
                })
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
        let { name, quantity, price  } = req.body;
        let parsedquantity = parseInt(quantity);
        let parsedPrice = parseFloat(price);
        let existingOrder = await Order.findOne({submitted: false});

        if (existingOrder) {
            const item = existingOrder.items.find(item => item.name === name)
            let totalPrice = existingOrder.totalPrice
            if (item) {
                item.quantity += parsedquantity;
                totalPrice += parsedPrice;
                existingOrder.totalPrice = 0;
                existingOrder.items.forEach(item => {
                    existingOrder.totalPrice += item.price * item.quantity
                })
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



 app.delete('/cart/:orderId', async (req,res) => {
    
       try{
        let { orderId } = req.params;
        let { itemId } = req.body;
        console.log('Order ID:', orderId);
        console.log('Item ID:', itemId);
        const updatedOrder = await Order.findOneAndUpdate(
            { id: orderId },
            { $pull: { items: { _id: itemId } } }, // Removes the item with the matching _id
            { new: true }
        );
        updatedOrder.totalPrice = 0
        updatedOrder.items.forEach(item => {
            updatedOrder.totalPrice += item.price * item.quantity
        })
        console.log('------delete/ cart',updatedOrder.totalPrice)
        await updatedOrder.save();
        if (!updatedOrder) {
            console.error('Order Not Found');
            return res.redirect('/cart');
        } else {
            console.log('-----Item Deleted ----')
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    res.redirect('/cart')
});

app.delete('/status/:orderId', async (req,res) => {
    
    try{
     let { orderId } = req.params;
     let { itemId } = req.body;
     console.log('Order ID:', orderId);
     console.log('Item ID:', itemId);
     const updatedOrder = await Order.findOneAndUpdate(
         { id: orderId },
         { $pull: { items: { _id: itemId } } }, // Removes the item with the matching _id
         { new: true }
     );
     updatedOrder.totalPrice = 0
     updatedOrder.items.forEach(item => {
         updatedOrder.totalPrice += item.price * item.quantity
     })
     console.log('------delete/ status',updatedOrder.totalPrice)
     await updatedOrder.save();
     if (!updatedOrder) {
         console.error('Order Not Found');
         return res.redirect('/status');
     } else {
         console.log('-----Item Deleted ----')
     }
 } catch (error) {
     console.error('Error:', error);
     res.status(500).send('Internal Server Error');
 }
 res.redirect('/status')
});


// meat.create({
//     "name": "Brisket",
//     "price": 33,
//     "quantity": 10,
//     "type": "Beef",
//     "image": "https://i.imgur.com/NQaILMZ.jpeg",
//     "desc": "Smoked for 12 hours made fresh everyday, seasoned with house-made bbq rub that is sweet, savory, and has a kick at the end of it. You get 10 slices of juicy cut brisket with your choice of our homemade tangy bbq sauce on the brisket or on the side."
//   });
//   meat.create({
//     "name": "Ribs",
//     "price": 27,
//     "quantity": 7,
//     "type": "Pork",
//     "image": "https://i.imgur.com/AVjxVmw.jpeg",
//     "desc": "Smoked for 8 hours made fresh everyday, seasoned with house-made bbq rub that is sweet, savory, and has a kick at the end of it. You get 8 bone-cuts  of juicy tender ribs with your choice of our homemade tangy bbq sauce on the ribs or on the side."
//   });
//   meat.create({
//     "name": "Tri-Tip",
//     "price": 19,
//     "quantity": 10,
//     "type": "Beef",
//     "image": "https://i.imgur.com/oQJTeoN.jpeg",
//     "desc": "Smoked for 2 hours then seared over a charcoal grill, made fresh everyday, seasoned with house-made bbq rub that is sweet, savory, and has a kick at the end of it. You get 1 full Tri-Tip in 10 tender slices with your choice of our homemade tangy bbq sauce on the brisket or on the side."
//   });
//   side.create({
//     "name": "Mac N Cheese",
//     "price": 10,
//     "scoops": 3,
//     "meat": [
//       "Bacon",
//       "None"
//     ],
//     "image": "https://i.imgur.com/JETkBXi.jpeg",
//     "desc": "4 cheese blend mac n cheese that is baked to perfection, made fresh everyday, seasoned with just salt and letting the cheese do the talking for itself. You get 3 healthy scoops of the creamy cheesy goodness with the choice of smoked bacon or no protein!"
//   });
//   side.create({
//     "name": "Candy Yams",
//     "price": 8,
//     "scoops": 2,
//     "meat": [
//       "None"
//     ],
//     "image": "https://i.imgur.com/RdvOfTb.jpeg",
//     "desc": "Brown sugar coated sweet potatoes turn into the perfect candy yams. Boiled until able to slide a fork straight through then baked until the sugars crystalize. You get 2 healthy scoops of rich candy goodness!"
//   });
//   side.create({
//     "name": "Collard Greens",
//     "price": 7,
//     "scoops": 2,
//     "meat": [
//       "Bacon"
//     ],
//     "image": "https://i.imgur.com/nfifprh.jpeg",
//     "desc": "3 leaf blend cooked inside chicken broth with a mix of garlic, salt, and red pepper flakes. You get 2 healthy scoops of the perfect smoky collard greens with the choice of smoked bacon or no protein"
//   });
//   drink.create({
//     "name": "Soda",
//     "price": 3,
//     "refills": false,
//     "type": [
//       "Sprite",
//       "Fanta Orange",
//       "Root Beer",
//       "Coca-Cola"
//     ],
//     "image": "https://i.imgur.com/TU6JK9B.jpeg",
//     "desc": "All cups are Large here, no small or medium sizes. So, come enjoy a large soda with us"
//   });
//   drink.create({
//     "name": "Juice",
//     "price": 2,
//     "refills": false,
//     "type": [
//       "Lemonade",
//       "Apple",
//       "Orange",
//       "Cranberry"
//     ],
//     "image": "https://i.imgur.com/Fj8ypjF.png",
//     "desc": "All cups are Large here, no small or medium sizes. So, come enjoy a large juice with us"
//   });
//   drink.create({
//     "name": "Water",
//     "price": 2,
//     "refills": true,
//     "type": [
//       "Bottled",
//       "Cup",
//       "Sparkling"
//     ],
//     "image": "https://i.imgur.com/Uu86sFj.jpg",
//     "desc": "With 3 different types of water, you have options to pick through. So, come enjoy some bottled, cup, or sparkling water with us."
//   });
//Order.collection.drop();



const server = app.listen(PORT, () => {
    console.log('🎧 Server is running on PORT 🎧', PORT);
});

module.exports = server;