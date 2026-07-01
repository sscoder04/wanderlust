const {Listing}=require("./models/listing");
const{listingSchema,reviewSchema}=require("./validation")
const Review=require("./models/review");

module.exports.validateSchema=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//storing path from where req is called because //we want to go back to the same page for user convinience;
        req.flash("error","Log in to make cahnges")
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    // when authentication is succesfull while log in passport resets the session data
    //therefore by using this middleware before authentication we store origanalUrl val
    //in locals which can be accessed because passport doesnt have access to them;
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.ownerAuthorisaton=async (req,res,next)=>{
    //this is used to check the id of the owner matches to the current user in session;
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("owner");
    console.log(listing.owner);
    console.log(res.locals.currUser._id);
    if(res.locals.currUser && listing.owner.equals(res.locals.currUser._id)){
            return next();
    }

    req.flash("error","permission denied! you are not the owner");
    return res.redirect(`/listings/${id}`);
     
}
module.exports.isReviewOwner=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId).populate("author")
    if(res.locals.currUser && review.author._id.equals(res.locals.currUser._id)){
        return next();
    }
     req.flash("error","permission denied! you are not the owner");
    return res.redirect(`/listings/${id}`);
}