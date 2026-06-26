module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;//storing path from where req is called because //we want to go back to the same page for user convinience;
        req.flash("error","Log in to make cahnges")
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    //the when authentication is succesfull while log in passport resets the session data
    //therefore by using this middleware before authentication we store origanalUrl val
    //in locals which can be accessed because passport doesnt have access to them;
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}