

// const meats = [
//     {
//         name: "Brisket",
//         price: 33.19,
//         quantity: 7,
//         type: "Beef",
//         image: "https://i.imgur.com/NQaILMZ.jpeg"
//     },
//     {
//         name: "Ribs",
//         price: 27.36,
//         quantity: 5,
//         type: "Pork",
//         image: "https://imgur.com/a/zOIim9p"
//     },
//     {
//         name: "Tri-Tip",
//         price: 19.55,
//         quantity: 10,
//         type: "Beef",
//         image: "https://imgur.com/a/JPOt1GC"
//     }
// ];


// module.exports = {
//     meats,
// }

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BensonBBQ');

const db = mongoose.connection;

// const {meats} = ('meats');
// console.log(meats);

db.once('open', () => console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
db.on('error', (error) => console.log('Database error\n', error));

// create the schema
const meatSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    type: String,
    image: String,
}, { timestamps: true });

// name and create the model
const meat = mongoose.model('meats', meatSchema);

// make this model available
module.exports = meat;