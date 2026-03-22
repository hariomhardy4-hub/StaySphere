let mongoose = require("mongoose");
const Review =require("./review.js");
let Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required : true,
    },
     description:{
        type:String,
        required : true,
       
     },
   image: {
    filename: {// ye chatgpt se thik kiya hai filename aur url ko alag-alag krke 
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b"
    }
},


    price:{
        type:Number,
        required : true,
    },
     
    location:{
        type:String,
        required: true,
    },
     country:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
    type:{
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
},
 category:{
    type:String,
    enum:["mountains","arctic","farms","mountain-cities","deserts"],
 }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){

   await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})
 const listing =  mongoose.model("listing",listingSchema);// model bnate samay new nhi ata
module.exports = listing;