const Transaction = require("../model/transaction");
const Property = require("../model/propertymodel");
const Booking = require("../model/bookingmodel");
const user = require("../model/user");
// const bookingmodel = require("../model/bookingmodel");



// Create transaction (rent or purchase)
exports.createTransaction = async (req, res) => {
  try {
    const { propertyId, amount, paymentMethod, type } = req.body;

    console.log("Incoming Request:", req.body);

    // 1. Check property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.status !== "available") {
      return res.status(400).json({ message: "Property is not available" });
    }

    // 2. Create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      property: propertyId,
      amount,
      paymentMethod,
      type, // rent | purchase
      status: "paid"
    });

    // 3. Update property status based on type
    let newStatus = "available";
    if (type === "purchase") newStatus = "sold";
    if (type === "rent") newStatus = "rented";

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { status: newStatus },
      { new: true }
    );

    // 4. Send response
    res.status(201).json({
      message: "Transaction successful",
      transaction,
      updatedProperty
    });

  } catch (err) {
    console.error("Transaction Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Book property inspection
exports.createBooking = async (req,res) => {
  try{
    const { propertyId, date } = req.body;

    const property = await Property.findById(propertyId);
    if(!property) return res.status(404).json({ message: 'Property not found' });

    const booking = await Booking.create({
      user: req.user._id,
      property: propertyId,
      date,
      status: 'pending'
    });
    // Populate user & property details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "username email phone")   // only show selected fields
      .populate("property", "title price location status");

    res.status(201).json(populatedBooking);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
};

// Get user transactions
exports.getUserTransactions = async (req,res) => {
  try{
    const transactions = await Transaction.find({ user: req.user._id }).populate('property');
    res.status(200).json(transactions);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
}

// Get user bookings
exports.getUserBookings = async (req,res) => {
  try{
    const bookings = await Booking.find({ user: req.user._id }).populate('property');
    res.status(200).json(bookings);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
}