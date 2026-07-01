const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../validation");
const Review=require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const methodoverride=require("method-override");
const mongoose=require("mongoose");
const {Listing}=require("../models/listing");
const {listingSchema}=require("../validation");
const{validateReview, isLoggedin}=require("../middleware");
const {isReviewOwner}=require("../middleware");
const reviewController=require("../controllers/review");



//post request
router.post("/",validateReview,
    isLoggedin,
    wrapAsync(reviewController.postReview));

//destroy review
router.delete("/:reviewId",
    isLoggedin,
    isReviewOwner,
    wrapAsync(reviewController.destroyReview));

    
module.exports=router;