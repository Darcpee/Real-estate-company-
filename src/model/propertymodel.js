const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: String,
    type: { type: String, enum: ["apartment","house","villa","land"],require: true},
    price:{ type: String},
    location: {
        city: String,
        address: String,
    },
    bedrooms: Number,
    bathrooms: Number,
    areaSqm: Number,
    amenities: [String],
    images:[String],
    status: { type: String, enum: ['pending','rented','paid'], default: 'pending' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }); 

module.exports = mongoose.model("property",propertySchema);