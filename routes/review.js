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
//validation middleware



//post request
router.post("/",validateReview,
    isLoggedin,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;//listings id
   let listing= await Listing.findById(id);
   let newReview=new Review(req.body);
   newReview.author= req.user._id;//user's ID;
   listing.review.push(newReview);

   await newReview.save();
   await listing.save();
    res.redirect(`/listings/${id}`);
}))

//DElETE review
router.delete("/:reviewId",
    isLoggedin,
    isReviewOwner,
    wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.updateOne({_id:id},{$pull:{review:reviewId}});
    await Review.findByIdAndDelete({_id:reviewId});
    req.flash("success","listing Deleted successfully!")
    res.redirect(`/listings/${id}`);
}))

module.exports=router;