const User = require('./user');
const meat = require('./meats');
const side = require('./sides');
const drink = require('./drinks');
const Order = require('./order');
const Status = require('./status');
require('dotenv').config()

const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

// export models
module.exports = { 
    User, meat, side, Order, Status, drink,

}
