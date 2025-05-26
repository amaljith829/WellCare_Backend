import mongoose from "mongoose";

mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"))

const connectDB = async () => { 
    await mongoose.connect(`${process.env.MONGO_URI}/WellCare`)

}

export  default connectDB