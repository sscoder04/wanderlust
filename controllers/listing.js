const {Listing}=require("../models/listing");


module.exports.index=async (req,res,next)=>{
    let data=await Listing.find()

    res.render("allListings",{data});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};

module.exports.postNewListing=async(req,res,next)=>{
    req.body.owner=req.user._id;
    const doc= new Listing(req.body);
   await doc.save();
   req.flash("success","new listing added successfully!");
   res.redirect("/listings");
}

module.exports.destroyListing=async (req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully!");
    res.redirect("/listings");
}

module.exports.renderListingInfo=async (req,res,next)=>{
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
}

module.exports.renderEditform=async(req,res,next)=>{
    let {id}=req.params;
    let data= await Listing.findById(id).populate("review").populate("owner");
    if(!data){
        req.flash("error","listing does not exist");
        return res.redirect("/listings");
    }
   
    res.render("edit",{data});
}

module.exports.updateListing=async (req,res,next)=>{
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
};