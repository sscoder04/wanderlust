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
const multer  = require('multer')

const {cloudinary,storage}=require("../cloudinary");

const upload = multer({ storage })
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin,
        upload.single("img"),
        validateSchema,
    wrapAsync(listingController.postNewListing));
    


router.get("/new",isLoggedin,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.renderListingInfo))
    .put(
    isLoggedin,
    ownerAuthorisaton,
    upload.single("img"),
    validateSchema,wrapAsync(listingController.updateListing))
    .delete(
    isLoggedin,
    ownerAuthorisaton,
    wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",
    isLoggedin,
    ownerAuthorisaton,
    wrapAsync(listingController.renderEditform));

    
module.exports=router;