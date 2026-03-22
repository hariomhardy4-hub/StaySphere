if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.use(methodOverride("_method"));// methodOverride ke andr hum _method ko use krne wale hai hum ye bta rhe hai
app.use(express.static(path.join(__dirname,"/public")));
 const dbUrl = process.env.ATLASDB_URL // ye humara localhost ka link hota tha jisse hum mongodb database se connect krte the
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./Models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


main()
   .then(()=>{
     console.log("db is connected");
    }).catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect( dbUrl);
}
app.set("view engine","ejs");// humara view engine hone wala hai ejs
app.set("views",path.join(__dirname,"views"));// git ke paath ke aage bus view ko jod denge ye is line ka matlab hai
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongo-store session options
const store =  MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error" ,() =>{
   console.log("error in mongo session store",err);
});

// root route
const sessionOptions = {
    store,
    secret :process.env.SECRET,
    resave : false,
    saveUninitialized:true,
    cookie : {
      expires  : Date.now()+7*24*60*60*1000,
      maxAge : 7*24*60*60*1000
    }
};



// app.get("/",(req,res)=>{
//  res.send("hi i am root");
// });  //  bahar se bhi koi request bej paa rha tha  / pe

app.use(session(sessionOptions));// session method ke andr session option dhyan rahe hariom session as  a middleware humne use kiya hai
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=> {// a middleware we created
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user || null;
   next();
});

// app.get("/demouser", async (req,res)=> {
//     let fakeUser = new User({
//        email  : "boy@gmail.com",
//        username : "sigma-student",

// })
 
//  let registeredUser =  await User.register(fakeUser,"helloIndia");// because it's a asynchronous method
//   res.send(registeredUser);

// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use((req,res,next )=> {  // *star ka mtlb haiagr request kisi bhi route se match nhi hui to ye wale se zarur match hogi hi hogi
    next( new ExpressError(404,"Page Not found!"));
});

app.use((err,req,res,next)=> {
    let {statusCode = 500   ,message = "Something went wrong"} = err;// pehle deconstruct kiya humne
   res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

// listen kr rha hai ya nhi pta krne ke liya
app.listen(8080, ()=>{
    console.log("server is listening");
});