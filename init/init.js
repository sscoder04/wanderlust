const mongoose=require("mongoose"); 
var {data}=require("./data");
const {Listing}=require("../models/listing");



const initDB=async()=>{
    await Listing.deleteMany({});
    data=data.map(obj=>( {...obj,owner:"6a3eabbc7dea30db6019f854"}));
    await Listing.insertMany(data);
    console.log("data initialised");
}

initDB();