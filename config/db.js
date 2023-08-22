import mongoose from "mongoose";

const connectToDB = async () => {

     try {
          const MONGO_URL = process.env.MONGODB_URI
          await mongoose.connect(MONGO_URL, {
               dbName: "content-crm",
               useNewUrlParser: true,
               useUnifiedTopology: true
          })
          console.log("Connect to MONGODB...")
     } catch (error) {
          console.log(error.message)
     }
}
export default connectToDB;