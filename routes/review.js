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
//validation middleware

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//post request
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
   let listing= await Listing.findById(id);
   let new_review=new Review(req.body);
   listing.review.push(new_review);

   await new_review.save();
   await listing.save();
   
    res.redirect(`/listings/${id}`);
}))

//DElETE review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.updateOne({_id:id},{$pull:{review:reviewId}});
    await Review.findByIdAndDelete({_id:reviewId});

    res.redirect(`/listings/${id}`);
}))

module.exports=router;