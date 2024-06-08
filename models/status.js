const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BensonBBQ');

const db = mongoose.connection;

// const {meats} = ('meats');
// console.log(meats);

db.once('open', () => console.log(`Connected to MongoDB at ${db.host}:${db.port}`));
db.on('error', (error) => console.log('Database error\n', error));

// create the schema
const statusSchema = new mongoose.Schema({
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
        }
    ],
    completed: Boolean,
    totalPrice: String,
    
}, { timestamps: true });

// name and create the model
const Status = mongoose.model('Status', statusSchema);

// make this model available
module.exports = Status;