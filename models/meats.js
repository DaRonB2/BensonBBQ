
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/BensonBBQ');

// const db = mongoose.connection;


// db.once('open', () => console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
// db.on('error', (error) => console.log('Database error\n', error));

// create the schema
const meatSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    type: String,
    image: String,
    desc: String,
}, { timestamps: true });

// name and create the model
const meat = mongoose.model('meats', meatSchema);

// make this model available
module.exports = meat;