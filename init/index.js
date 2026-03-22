const mongoose = require("mongoose");// data wali file ko chod ke humne hr jagah mongoose ko require kiya hai
const initData = require("./data.js"); // data wali ko require kiya humne
// isliye hum model wale folder ko alag banate hai
const listing = require("../Models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
   .then(()=>{
     console.log("db is connected");
    }).catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect( MONGO_URL);
}
const initDB = async () => {
    await listing.deleteMany({});// sara data delete hojayega uske baad hum apne data ko insert krenge
   initData.data =  initData.data.map((obj) =>({...obj,owner:'69b8134a27b025a9734d3b15'}));
    await listing.insertMany(initData.data);// initData apne aap mein ek object hai uske andr data array ke saare index ke data ko insert krna chah rhe hai hum
    console.log("data was initialized");
}
initDB();// yaha call lgake humne data khali kiya aur new data initialise bhi kr diya