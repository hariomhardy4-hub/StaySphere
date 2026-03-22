const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

module.exports.createReview = async (req,res) => {
    console.log(req.params.id);
    // review ko store krvana hai mtlb review wala model ko access krne ke liye require krna hoga 
   let listing = await Listing.findById(req.params.id);// url wale id ko access kiya humne
   let newReview = new Review(req.body.review);// review object aya tha form submit krne ke baad
   
   listing.reviews.push(newReview);
   newReview.author = req.user._id; 
   console.log(newReview);
   await newReview.save();
    await listing.save();
   req.flash("success","your review has been added");
    
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req,res)=>{
    
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","your review has been deleted");
    res.redirect(`/listings/${id}`);
};