const mongoose = require("mongoose");
 
const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',       // Reference to User model
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',   // Reference to Property model
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank', 'wallet', 'cash'], // optional, adjust as needed
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed','rented'],
    default: 'pending'
  }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Transaction', TransactionSchema);
