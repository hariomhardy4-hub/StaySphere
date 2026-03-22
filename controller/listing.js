
const Listing = require("../Models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });
module.exports.index = async (req,res)=>{
    const allListings =  await Listing.find({}) // yaha pr khali listing.find hi kyu likha ??,aur ye thenable bhi ho gya ??
        // humare console pr data hai aa rha hai bus ab ise hume ejs file ko bejna hai aur phir data ke according display hoga
    res.render("listings/index.ejs",{allListings});// all listings ko bhi hume pass krna hoga kyu ki usi mein saare data hai to display
};

module.exports.renderNewForm = (req,res)=>{// new ko express id samaj ke search kr rha hai isliye hume use upr likhna hoga
 
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res,next) =>{
  let {id} = req.params;
  const list = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate :{
      path:  "author"
    },
})
  .populate("owner");
  if(!list){
    req.flash("error","Listing you requested doesn't exist");
 return  res.redirect("/listings");
}
  
  res.render("listings/show.ejs",{
    list,  
   currUser:req.user,
    mapToken: process.env.MAP_TOKEN
  }
   );
};

module.exports.createListing = async (req,res,next)=>{
     let response = await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send();
  

      let url = req.file.path;
      let filename = req.file.filename;
    console.log(response.body.features[0].geometry);
      
   const  newListing =  new Listing(req.body.listing);// ek naya document pass kr rhe hai hum listimg collection ke andr hum
   
   newListing.owner = req.user._id;
   if(!newListing.image.url){
        newListing.image.url = "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b";
    }
    newListing.image={filename,url};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();// save kiya humne document ko collection mein aur humara data database ke andr save ho jayega
   console.log(savedListing);
    req.flash("success","New listing has been added");// created a flash you don't need a variable for that
   res.redirect("/listings");
  
        };

module.exports.renderEditForm = async (req,res)=>{
     let {id} = req.params;// pehle id nikala humne 
     const list =  await Listing.findById(id); // humne vo wale listing ko find kiya hai 
     if(!list){
        req.flash("error","the listing you want to update doesn't exist");
        return res.redirect("/listings");
    }
   let originalImageUrl = list.image.url;
  originalImageUrl =  originalImageUrl.replace("/upload","/upload/h_300,w_250");
    
     res.render("listings/edit.ejs",{list,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
   let {id} = req.params;// ye kyu uda rhe ho iska use ye route mein hai
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});// ye supplied object se hi hum existing document ke data ko update kr rhe hai
  if(typeof req.file !== "undefined"){
      let url = req.file.path;// image isliye 
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
  }
  req.flash("success","your listing has been updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
  
    let {id} = req.params;//id ko extract from url 
await Listing.findByIdAndDelete(id);
req.flash("success","listing deleted successfully");
res.redirect("/listings");
}