const mongoose=require("mongoose");

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
            set:v=>{
                return v===""?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYcqsWcjnaHmF0s6uWWkuuJKPfT13YDDOG-f16vsJlhKdVmBaLJKTjpKTq&s=10":v
            }
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
    }
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().
then(()=>{
    console.log("connection completed")
}).catch(err=>{
    console.log(err);
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports={Listing};