const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema}=require("../validation");
const {Listing}=require("../models/listing");
const {reviewSchema}=require("../validation");


const validateSchema=(req,res,next)=>{
    console.log(req.body);
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

router.get("/",wrapAsync(async (req,res,next)=>{
    let data=await Listing.find()

    res.render("allListings",{data});
}))

//new route
router.get("/new",(req,res)=>{
    res.render("new.ejs");
    
})

router.post("/",validateSchema,wrapAsync(async(req,res,next)=>{
   const doc= new Listing(req.body);
   console.log(doc.img.url);
   await doc.save();
   res.redirect("/listings");
}))

//delete route;
router.delete("/",wrapAsync(async (req,res,next)=>{
    let id=req.body._id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

//show route//
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate("review")
    if(!data){
        next(new ExpressError(403,"-----listing not found-----"))
    }
    res.render("info",{data})
}))

//edit route
router.get("/:id/edit",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    console.log(id);
    let data= await Listing.findById(id)

    res.render("edit",{data});
}))

router.put("/:id",validateSchema,wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const update=req.body;
    let response=await Listing.replaceOne({_id:id},update,{
        new:true,
        runValidators:true,
    });
       
    console.log("matchedCount: ",response.matchedCount);
    res.redirect(`/listings/${id}`);
}));

module.exports=router;