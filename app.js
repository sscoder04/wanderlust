const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app=express();
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const listing=require("./routes/listing");
const review=require("./routes/review")
const session=require("express-session");
const flash=require("connect-flash");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().
then(()=>{
    console.log("connected to DB")
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



const sessionOptions={
    secret:"mySecret",
    resave:false,
    saveUninitialized:true,
}
app.use(session(sessionOptions));
app.use(flash()); 


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

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

  