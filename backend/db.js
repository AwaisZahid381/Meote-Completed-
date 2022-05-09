const mongoose = require("mongoose") // getting connect with mongo db compass with mongoose
const mongoURI = "mongodb://localhost:27017/meote" // use the string provided by mongo db compass

// defining a function that gives us the information about the connection with Mongo DB Compass
const connecToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully"); // This will tell us that the database is connected 
    })
}
module.exports = connecToMongo; // exporting the connecting function