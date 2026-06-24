const express=require("express");
const mongoose=require("mongoose");
const {Listing}=require("./models/listing");
const path=require("path");
const app=express();
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {reviewSchema}=require("./validation");
const Review=require("./models/review");
const listing=require("./routes/listing");
const review=require("./routes/review")

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().
then(()=>{
    console.log("connection completed")
}).catch(err=>{
    console.log(err);
})
app.engine("ejs",ejsMate);
app.use(methodoverride("_method"));
app.set("views",path.join(__dirname,"views/listings"));
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


app.use("/listings",listing);
app.use("/listings/:id/reviews",review);


app.listen(8080,()=>{
    console.log("port is listening");
});


// this is error handling
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    res.render("error",{err});
})

  