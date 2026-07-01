const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema}=require("../validation");
const {reviewSchema}=require("../validation");
const {Listing}=require("../models/listing");
const User=require("../models/user");
const {isLoggedin}=require("../middleware");
const {ownerAuthorisaton}=require("../middleware");
const{validateSchema}=require("../middleware");



router.get("/",wrapAsync(async (req,res,next)=>{
    let data=await Listing.find()

    res.render("allListings",{data});
}))

//new route
router.get("/new",isLoggedin,(req,res)=>{
    res.render("new.ejs");
    
})

router.post("/",isLoggedin,validateSchema,wrapAsync(async(req,res,next)=>{
    req.body.owner=req.user._id;
    const doc= new Listing(req.body);
   await doc.save();
   req.flash("success","new listing added successfully!");
   res.redirect("/listings");
}))

//delete route;
router.delete("/:id",
    isLoggedin,
    ownerAuthorisaton,
    wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully!");
    res.redirect("/listings");
}))

//show route//
router.get("/:id",
    wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({path:"review",
        populate:{
            path:"author",
        }
    }).populate("owner");
    if(!data){
        req.flash("error","listing does not exist");
        return res.redirect("/listings");
    }

    res.render("info",{data})
}))

//edit route
router.get("/:id/edit",
    isLoggedin,
    ownerAuthorisaton,
    wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let data= await Listing.findById(id).populate("review").populate("owner");
    if(!data){
        req.flash("error","listing does not exist");
        return res.redirect("/listings");
    }
   
    res.render("edit",{data});
}))

router.put("/:id",
    isLoggedin,
    ownerAuthorisaton,
    validateSchema,wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    req.body.owner=req.user._id;
    const update=req.body;
    let response=await Listing.replaceOne({_id:id},update,{
        new:true,
        runValidators:true,
    });
    req.flash("success","listing updated successfully!");   
    console.log("matchedCount: ",response.matchedCount);
    res.redirect(`/listings/${id}`);
}));

module.exports=router;