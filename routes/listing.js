const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../Models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const listing = require("../Models/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image][url]'),
     wrapAsync( listingController.createListing)
   // new ejs se hume saari ki saari chizo ko nikalna padega manual tarika to extract form data let {title,description,image,price,location,country}= req.body;
  
     // 2nd tarika jisse syntax thoda chota hoga new.ejs ke andr listing object key value pair banane ke baad 
 );


 // NEW route  upr isliye likha kyu ki server 
router.get("/new",isLoggedIn,listingController.renderNewForm);

 router
 .route("/:id")
 .get( wrapAsync(listingController.showListing)
)
 .put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image][url]'),// listing ke pura data to fulfill hojane do validate tb kr lena pehle pura data to lelo
  validateListing,
   
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync( listingController.destroyListing)
);


  





// show route






 // edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner, 
  wrapAsync(listingController.renderEditForm)
);


// update route

// delete route

module.exports = router;