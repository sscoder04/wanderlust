const express=require("express");
const router=express.Router();
const User=require("../models/user");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl}=require("../middleware");
//signup
router.get("/signup",(req,res)=>{
    res.render("../user/Signup");
})

router.post("/signup",async (req,res)=>{
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
   
})

//log-in
router.get("/login",(req,res)=>{
    res.render("../user/login")
})
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login"
}),async(req,res)=>{
    let{username}=req.body;
    req.flash("success",`Welocome ${username}`);
    let redirectUrl=res.locals.redirectUrl || "/listings"
    return res.redirect(redirectUrl);
})

//logout
router.get("/logout",(req,res)=>{
    req.logout(err=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
})



module.exports=router;