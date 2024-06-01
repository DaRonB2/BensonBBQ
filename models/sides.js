// const sides = [
//         {
//             name: "Mac N Cheese",
//             price: 9.75,
//             scoops: 3,
//             meat: ["Bacon", "None"],
//             image: "https://i.imgur.com/NQaILMZ.jpeg"
//         },
//         {
//             name: "Candy Yams",
//             price: 7.99,
//             scoops: 2,
//             meat: ["None"],
//             image: "https://imgur.com/a/zOIim9p"
//         },
//         {
//             name: "Collard Greens",
//             price: 6.99,
//             scoops: 2,
//             meat: ["Bacon"],
//             image: "https://imgur.com/a/JPOt1GC"
//         }
//     ];
    
    
//     module.exports = {
//         sides,
//     }

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BensonBBQ');

const db = mongoose.connection;

db.once('open', () => console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
db.on('error', (error) => console.log('Database error\n', error));

// create the schema
const sideSchema = new mongoose.Schema({
    name: String,
    price: Number,
    scoops: Number,
    meat: Array,
    image: String,
}, { timestamps: true });

// name and create the model
const side = mongoose.model('Side', sideSchema);

// make this model available
module.exports = side;