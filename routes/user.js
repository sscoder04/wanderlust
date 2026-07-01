const express=require("express");
const router=express.Router();
const User=require("../models/user");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl}=require("../middleware");
const userController=require("../controllers/user");


router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.postSignup);
 


router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
    passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login"
}),userController.postLogin);


router.get("/logout",userController.logout);



module.exports=router;