const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model("Booking",BookingSchema);



