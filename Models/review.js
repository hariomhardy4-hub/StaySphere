let mongoose = require("mongoose");// database mein review store hongi aur mongoose library hai vo database aur js ki files se manipulation ka power deti hai
let Schema = mongoose.Schema;// line mean importing Schema constructor from mongoose library to create model
const reviewSchema = new Schema({
    comment : {
        type: String,
      
    },
    rating: {
        type : Number,
        min : 1,
        max: 5
    },
    createAt : {
        type : Date,
        default : Date.now()//document creation ka current date or time bydefault set ho jayega
    },
    author : {
           type : Schema.Types.ObjectId,
           ref: "User",
    }
});

   module.exports = mongoose.model("Review",reviewSchema);