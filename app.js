const express=require("express");
const mongoose=require("mongoose");
const {Listing}=require("./models/listing");
const path=require("path");
const app=express();
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");

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

app.get("/listings",wrapAsync(async (req,res,next)=>{
    let data=await Listing.find()

    res.render("allListings",{data});
}))

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
    
})
app.post("/listings",wrapAsync(async(req,res,next)=>{
   let data=req.body;
   const doc= new Listing(data);
   console.log(data);
   await doc.save();
   res.redirect("/listings");
}))

app.delete("/listings",wrapAsync(async (req,res,next)=>{
    let id=req.body._id;
    await Listing.deleteOne({_id:id});
    res.redirect("/listings");
}))

app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id)
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
app.put("/listings",wrapAsync(async (req,res,next)=>{
    let id=req.body._id;
    const update=req.body;
    let response=await Listing.replaceOne({_id:id},update,{
        new:true,
        runValidators:true,
    });
       
    console.log("matchedCount: ",response.matchedCount);
    res.redirect(`/listings/${id}`);
}))

// error handling;
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    res.render("error",{err});
})

  