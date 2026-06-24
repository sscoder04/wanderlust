const express=require("express");
const mongoose=require("mongoose");
const {Listing}=require("./models/listing");
const path=require("path");
const app=express();
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./validation")
const {reviewSchema}=require("./validation");
const Review=require("./models/review");


app.engine("ejs",ejsMate);
app.use(methodoverride("_method"));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().
then(()=>{
    console.log("connection completed")
}).catch(err=>{
    console.log(err);
})

app.set("views",path.join(__dirname,"views/listings"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.listen(8080,()=>{
    console.log("port is listening");
});


//validation middleware
const validateSchema=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
app.get("/listings",wrapAsync(async (req,res,next)=>{
    let data=await Listing.find()

    res.render("allListings",{data});
}))

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
    
})
app.post("/listings",validateSchema,wrapAsync(async(req,res,next)=>{
   const doc= new Listing(req.body);
   await doc.save();
   res.redirect("/listings");
}))
//delete route;
app.delete("/listings",wrapAsync(async (req,res,next)=>{
    let id=req.body._id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

//show route//
app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate("review")
    if(!data){
        next(new ExpressError(403,"-----listing not found-----"))
    }
    res.render("info",{data})
}))

app.get("/listings/:id/edit",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    console.log(id);
    let data= await Listing.findById(id)

    res.render("edit",{data});
}))

app.put("/listings",validateSchema,wrapAsync(async (req,res,next)=>{
    let id=req.body._id;
    const update=req.body;
    let response=await Listing.replaceOne({_id:id},update,{
        new:true,
        runValidators:true,
    });
       
    console.log("matchedCount: ",response.matchedCount);
    res.redirect(`/listings/${id}`);
}))


//-------reviews block-----------------
//post request
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
   let listing= await Listing.findById(id);
   let new_review=new Review(req.body);
   listing.review.push(new_review);

   await new_review.save();
   await listing.save();
   
    res.redirect(`/listings/${id}`);
}))

//DElETE review
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.updateOne({_id:id},{$pull:{review:reviewId}});
    await Review.findByIdAndDelete({_id:reviewId});

    res.redirect(`/listings/${id}`);
}))





// this is error handling
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    res.render("error",{err});
})

  