const {Listing}=require("../models/listing");
const {categories}=require("../init/categories");

module.exports.index=async (req,res,next)=>{
    let {category}=req.query;
    let present= categories.includes(category);

    if(!category){
        let data=await Listing.find();
         return res.render("allListings",{data});
    }else if(!present){
        req.flash("error","category doesnt exist")
        return res.redirect("/listings")
    }

    let data=await Listing.find({category:category});
    res.render("allListings",{data});
   
}

module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};

module.exports.postNewListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    req.body.owner=req.user._id;
    const doc= new Listing(req.body);
    doc.img={url,filename};
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
   let originalUrl=data.img.url;
   originalUrl=originalUrl.replace("/upload","/upload/c_scale,h_200,w_200/")
    res.render("edit",{data,originalUrl});
}

module.exports.updateListing=async (req,res,next)=>{
    let {id}=req.params;
    req.body.owner=req.user._id;
    console.log(req.body);
    let listing= await Listing.findByIdAndUpdate(id,{...req.body},{returnDocument:"after"});
    if(typeof req.file !="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.img={url,filename};
        await listing.save();
    }
    req.flash("success","listing updated successfully!");   
    res.redirect(`/listings/${id}`);
};