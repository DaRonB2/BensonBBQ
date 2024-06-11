
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/BensonBBQ');

// const db = mongoose.connection;

// db.once('open', () => console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
// db.on('error', (error) => console.log('Database error\n', error));

// create the schema
const sideSchema = new mongoose.Schema({
    name: String,
    price: Number,
    scoops: Number,
    meat: Array,
    image: String,
    desc: String,
}, { timestamps: true });

// name and create the model
const side = mongoose.model('Side', sideSchema);

// make this model available
module.exports = side;