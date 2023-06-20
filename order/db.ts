import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectDB=async()=>{
    try{
        const mongourl=process.env.MONGO_URL;
        if(mongourl){
            await mongoose.connect(mongourl)
            console.log("Connected to database")
        }
    }catch(err){
        console.log(err)
    }
}

export default connectDB