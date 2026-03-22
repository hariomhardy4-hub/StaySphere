const Listing = require("./Models/listing.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./Models/review");
module.exports.isLoggedIn = (req,res,next) => {

if(!req.isAuthenticated()){// is blnfdock ke andr store karenge kyu ki hume tbhi redirect krna hai jb user login na ho
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
     if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
     }
     next();
}

module.exports.isOwner =  async (req,res,next) => {
  let {id} = req.params;// id ko extract kiya
     let listing = await Listing.findById(id); // database ka use hai isliye await
     if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("success","You are not the owner of this listing");
     return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.validateListing = (req,res,next)=> {
     let {error} =   listingSchema.validate(req.body);// jo humne listingSchema defined kiya hai use req.body mein aayi hui chize accept kr rhi hai
   if(error){
    let errMsg = error.details.map((el) => el.message).join(",");//comma se join kr diya  error ki saari details ko hum print krva rhe hai separated by comma
    throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=> {
     let {error} =   reviewSchema.validate(req.body);// jo humne listingSchema defined kiya hai use req.body mein aayi hui chize accept kr rhi hai
   if(error){
    let errMsg = error.details.map((el) => el.message).join(",");//comma se join kr diya  error ki saari details ko hum print krva rhe hai separated by comma
    throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor =  async (req,res,next) => {
  let {id,reviewId} = req.params;// id ko extract kiya
     let review = await Review.findById(reviewId); // database ka use hai isliye await
     if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("success","You are not the author of this review");
      return  res.redirect(`/listings/${id}`);
     }
     next();
}
