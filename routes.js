const express = require("express");
const { register, loginUser, updateUser } = require("./src/Auth/controller");
const { protect, authorize } = require("./src/Auth/middleware/authMiddleware");
const router =express.Router();
const { addProperty, getProperties, getProperty, deleteProperty, updatePropertyStatus } = require("./src/Auth/property");
const { upload } = require("./cloudinary");
const { createTransaction, createBooking, getUserTransactions, getUserBookings } = require("./src/Auth/transaction");
const { searchProperties } = require("./src/Auth/search");




router.post("/register",register);
router.get("/loginUser",loginUser);
router.put("/updateuser",updateUser);
router.put("/updateUser/:id",updateUser)
router.get("/protect",protect, (req, res) =>{
    res.json({
        _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
    });
});
router.get("/admin-only", protect, authorize("admin"), (req,res) => {
    res.json({ message: "welcome admin,you have access"});
});
router.post("/addProperty",upload.array("images", 5), addProperty);
//router.post("/addProperty",addProperty)
router.post("/getProperty",getProperty);
router.delete("/deleteProperty/:id",deleteProperty);
router.post("/createTransaction",protect,createTransaction);
router.post("/createBooking",protect,createBooking);
router.get("/getUserTransaction",getUserTransactions);
router.get("/getUserBookings",getUserBookings);
router.get("/searchproperties",searchProperties);
router.put("/updatepropertystatus",updatePropertyStatus);







module.exports=router