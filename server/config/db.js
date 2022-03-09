import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.DATABASE_URL;

mongoose.Promise = global.Promise;
mongoose.connect(
  URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if(err) return console.log("error: ",err)
    console.log("Connected Database...");
  }
);
