const express=require("express");
const router=express.Router();
const User=require("../models/user");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl}=require("../middleware");
const userController=require("../controllers/user");
//signup
router.get("/signup",userController.renderSignupForm);

router.post("/signup",userController.postSignup);

//log-in
router.get("/login",userController.renderLoginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login"
}),userController.postLogin);

//logout
router.get("/logout",userController.logout);



module.exports=router;