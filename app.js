require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app=express();
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const listingRouter=require("./routes/listing");
const reviewRouter=require("./routes/review")
const userRouter=require("./routes/user");
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./models/user");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {categories}=require("./init/categories");




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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//deafult set the name of the startegy to "local" but we can give our own name

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.categories=categories;
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.listen(8080,()=>{
    console.log("port is listening");
});


// this is error handling
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    console.log(err);
    res.render("error",{err});
})

  