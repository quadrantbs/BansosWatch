const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
  
const db = new MongoClient(uri).db("bansoswatch");

module.exports = { db };