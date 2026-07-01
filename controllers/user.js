const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("../user/Signup");
};

module.exports.postSignup=async (req,res)=>{
    try{
         let{username,email,password}=req.body;
    const newUser=new User({
           email:email,
           username:username
       })
       let registered=await User.register(newUser,password);
       req.login(registered,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","sign-up successfull!");
            return res.redirect("/listings");
       })
      
    }catch(err){
        req.flash("error",err.message);
        return res.redirect("/signup")
    }
   
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("../user/login")
}

module.exports.postLogin=async(req,res)=>{
    let{username}=req.body;
    req.flash("success",`Welocome ${username}`);
    let redirectUrl=res.locals.redirectUrl || "/listings"
    return res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout(err=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
};