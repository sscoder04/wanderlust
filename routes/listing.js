const express=require("express");
const router=express.Router();
exports.router = router;
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
const listingController=require("../controllers/listing");


router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedin,listingController.renderNewForm);

router.post("/",isLoggedin,validateSchema,
    wrapAsync(listingController.postNewListing));

//destroy route;
router.delete("/:id",
    isLoggedin,
    ownerAuthorisaton,
    wrapAsync(listingController.destroyListing));

//show route
router.get("/:id",wrapAsync(listingController.renderListingInfo));

//edit route
router.get("/:id/edit",
    isLoggedin,
    ownerAuthorisaton,
    wrapAsync(listingController.renderEditform));

router.put("/:id",
    isLoggedin,
    ownerAuthorisaton,
    validateSchema,wrapAsync(listingController.updateListing));


    
module.exports=router;