const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['buyer','seller','agent','admin'], default: 'buyer' },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("User", UserSchema);

// const AdminSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     password: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String },
//        isAdmin:{
//         type:Boolean,
//         default:true,
//     },
//     createdAt: {type: Date, default: Date.now},
//  });
    

//  module.exports = mongoose.model("Admin", AdminSchema);
