const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app =express();
const mongoose = require("mongoose");
const router= require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const DB =process.env.DB





app.use(express.json());
app.use("/",router);
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "HTML-CSS-COURSE")));




app.listen(3500,async()=>{
    console.log("server is running on http://localhost:3500")
    try {
        await mongoose.connect(DB);
        console.log("DB is connected");
    } catch (error) {
        console.log(error)
    }
})