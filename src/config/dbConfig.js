import { config } from "dotenv";
import mongoose from "mongoose";

config();

const MONGODB_URL = `${process.env.MONGODB_URL}`;

const connectDb = async () => {
    try{
        mongoose.connect(MONGODB_URL);
        mongoose.set("strictQuery", true);
        
        console.log(`The Mongo connection was successful!`)
    }catch(err){
        console.log(`Connection failed ${err}`);
    }
}
export default connectDb;