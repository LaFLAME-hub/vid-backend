import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
})

console.log({
    cloud: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secretExists: !!process.env.CLOUDINARY_API_SECRET
});

const port = process.env.PORT || 7000

connectDB()
.then(() => {
    app.listen(port, () => {
    console.log(`Server is running at ${port}`);
    
})
})
.catch((err) => {
    console.log("MongoDB Connection Error ", err);
    
})

