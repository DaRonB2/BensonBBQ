// const drinks = [
//     {
//         name: "Soda",
//         price: 19.55,
//         refills: false,
//         type: [
//             "Sprite", "Fanta Orange", "Root Beer", "Coca-Cola"
//         ],
//         image: "https://imgur.com/a/RjBk0Yr"
//     },
//     {
//         name: "Juice",
//         price: 19.55,
//         refills: false,
//         type: [
//             "Lemonade", "Apple", "Orange", "Cranberry"
//         ],
//         image: "https://imgur.com/a/PZ8zOz4"
//     },
//     {
//         name: "Water",
//         price: 19.55,
//         refills: true,
//         type: [
//             "Bottled", "Cup", "Sparkling"
//         ],
//         image: "https://imgur.com/a/QUOYh3l"
//     }
// ];


// module.exports = {
//     drinks,
// }

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BensonBBQ');

const db = mongoose.connection;

db.once('open', () => console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
db.on('error', (error) => console.log('Database error\n', error));

// create the schema
const drinkSchema = new mongoose.Schema({
    name: String,
    price: Number,
    refills: Boolean,
    type: Array,
    image: String,
    desc: String,
}, { timestamps: true });

// name and create the model
const drink = mongoose.model('Drink', drinkSchema);

// make this model available
module.exports = drink;