const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt=10;
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const dotenv = require("dotenv");
require("dotenv").config();

//dotenv.config();





//ADD USER
exports.register = async (req,res)=>{
const { username, phone, password, email, role, secretKey } = req.body;
const hashedpassword = await bcrypt.hash(password,salt)
try {
  // Default role is always buyer
    let userRole = "buyer";

     // If the person tries to be seller or agent → allow it
    if (role === "seller" || role === "agent") {
      userRole = role;
    }

    // If the person tries to be admin → check secretKey first
    if (role === "admin") {
      if (secretKey !== process.env.ADMIN_SECRET) {
        return res
          .status(403)
          .json({ message: "You are not allowed to register as admin" });
      }
      userRole = "admin"; // valid secret → allow admin
    }
    const newuser = new User({
     username,
     phone,
     password:hashedpassword,
     email,
     role:userRole,

    })
    const saveduser = await newuser.save()
    res.status(200).json({ message:"registration succesful", User: saveduser});
} catch (error) {
   console.log(error);
   res.status(500).json("error"); 
}
}

// LOGIN USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  

  try {
    const loginuser = await User.findOne({ email });
    console.log("Found user:", loginuser);

    if (!loginuser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, loginuser.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
    const token = jwt.sign(
      { userId: loginuser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // send token and user info back
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: { userId: loginuser._id, email: loginuser.email,role: loginuser.role },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.updateUser = async(req,res) =>{
    const { username, newusername } = req.body;

     try {
    const updatedUser = await User.findOneAndUpdate(
      { username }, // Find by name
      { $set: newusername }, // Apply updates
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found with the specified name",
      });
    }

    console.log("Updated user:", updatedUser); // For debugging (optional)

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during user update",
    });
  }
};

//updateuserByID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;        // Get user ID from URL
     console.log("Received ID:", id);

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate fields based on schema
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};