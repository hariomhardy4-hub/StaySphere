let User = require("../Models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup =async (req,res) => {
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email,username});//new User mein khali pass krne se ho jayega gajab yrr
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err) =>{
        if(err){
            next(err);
        }
          req.flash("success","Welcome to StaySphere");// isse message splash hogya yrr
    res.redirect("/listings");// agr error nhi aaya to ye dono chixe hum krna chahte hai
    })
   
    } catch(e){  // ye bracket ke andr e se hum error ko catch kr rhe hai . ye e ya err ek object hai kbhi hum e ya kbhi err likhte hai
        req.flash("error",e.message);
        res.redirect("/signup");
    }
 
};

module.exports.renderLoginForm = (req,res)=> {
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) =>{// database se check krna hoga isliye async
    req.flash("success","Welcome back to StaySphere you are logged in !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);// agr login hogya authentitcation ke baad to yaha redirect krdo
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","logged out successfully");
        res.redirect("/listings");
});
};

