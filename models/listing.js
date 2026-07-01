const mongoose=require("mongoose");
const {Schema}=mongoose;
const Review=require("./review");
const User=require("./user");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().catch(err=>{
    console.log(err);
})

const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    img:{
        filename:String,
        url:{
            type:String,
        }
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
         required:true,
    },
    country:{
        type:String,
        required:true,
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum:["trending","mountains","beaches","snow","iconic cities","countryside","skiing"],
    }
})
//post/pre middleware(the pre middle ware should be 
// defined before using moongose.model())
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        let {review}=listing;
        console.log(review);
        let res=await Review.deleteMany({_id:{$in:review}});
        console.log(res);
    } 

})


const Listing=mongoose.model("Listing",listingSchema);
module.exports={Listing};