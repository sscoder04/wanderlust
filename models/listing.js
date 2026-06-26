const mongoose=require("mongoose");
const {Schema}=mongoose;
const Review=require("./review");

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
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYcqsWcjnaHmF0s6uWWkuuJKPfT13YDDOG-f16vsJlhKdVmBaLJKTjpKTq&s=10",
            set: v =>
                v === "" || v === undefined
                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYcqsWcjnaHmF0s6uWWkuuJKPfT13YDDOG-f16vsJlhKdVmBaLJKTjpKTq&s=10"
                        : v
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
    }]
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