import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import "./config/db.js";
import API from "./routes/index.js";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json({ extended: false, limit: "500mb" }));
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "500mb",
    parameterLimit: 50000,
  })
);

app.use("/api", API);
app.use('/api/test', (req, res)=>{
  res.status(200).json({msg: 'it is work!'})
})

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
