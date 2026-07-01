const Review=require("../models/review");
const {Listing}=require("../models/listing");
module.exports.postReview=async(req,res)=>{
    let {id}=req.params;//listings id
   let listing= await Listing.findById(id);
   let newReview=new Review(req.body);
   newReview.author= req.user._id;//user's ID;
   listing.review.push(newReview);

   await newReview.save();
   await listing.save();
    res.redirect(`/listings/${id}`);
}
module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.updateOne({_id:id},{$pull:{review:reviewId}});
    await Review.findByIdAndDelete({_id:reviewId});
    req.flash("success","listing Deleted successfully!")
    res.redirect(`/listings/${id}`);
}