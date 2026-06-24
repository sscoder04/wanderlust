const mongoose=require("mongoose");
const {Schema}=mongoose;
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().
then(()=>{
    console.log("connection completed")
}).catch(err=>{
    console.log(err);
}) 

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,max:5
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});

const Review=mongoose.model("Review",reviewSchema);

module.exports=Review;

