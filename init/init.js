const mongoose=require("mongoose"); 
const {data}=require("./data");
const {Listing}=require("../models/listing");



const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("data initialised");
}

initDB();