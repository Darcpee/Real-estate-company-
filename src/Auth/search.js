const property = require("../model/propertymodel");

exports.searchProperties = async (req, res) => {
  try {
    const { q } = req.query; // "q" will hold the search keyword

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Use regex for partial matching (case-insensitive)
    const properties = await property.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { type: { $regex: q, $options: "i" } },
        { minprice: {$regex: q, $options: "i" } },
        { maxprice: {$regex: q, $options: "i" } }
      ]
    });

    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
