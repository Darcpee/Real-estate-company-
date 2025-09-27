const Property = require("../model/propertymodel");
const sharp = require("sharp");
const { uploadBuffer} = require("../../cloudinary");


exports.addProperty = async (req, res) => {
  try {
    console.log("addProperty endpoint called");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const {
      title,
      description,
      type,
      price,
      location,
      amenities,
      bedrooms,
      bathrooms,
      areaSqm,
    } = req.body;
     // Parse location if JSON string
    try {
      location = JSON.parse(location);
    } catch {
      // keep as string if not JSON
    }

    // Upload all images to Cloudinary
     // Upload images safely
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const url = await uploadBuffer(file.buffer, "properties");
          imageUrls.push(url);
        } catch (err) {
          console.error("Failed to upload image:", file.originalname, err.message);
          // continue without this image
        }
      }
    }

    // Create new property object
    const newProperty = new Property({
      title,
      description,
      type,
      price,
      location:  (() => {
    try { return JSON.parse(location); }
    catch { return { city: location || "" }; }
  })(),
      bedrooms:  Number(bedrooms) || 0,
      bathrooms:  Number(bathrooms) || 0,
      areaSqm: Number(areaSqm) || 0,
      amenities: amenities ? amenities.split(",").map(a => a.trim()) : [],
      images: imageUrls,
      // owner: req.user._id, // Uncomment if using auth
    });

    // Save property to database
    const savedProperty = await newProperty.save();
    console.log("Property added successfully:", savedProperty);

    return res.status(201).json({
      message: "Property added successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error("Error adding property:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//GET PROPERTIES
exports.getProperty = async (req, res) => {
  try {
    // If ID is provided in params, return that property
    if (req.params.id) {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      return res.status(200).json(property);
    }

    // Otherwise, apply filters from query params
    const filters = {};
    if (req.query.location) filters.location = req.query.location;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.price) filters.price = { $lte: req.query.price };

    const properties = await Property.find(filters);
    res.status(200).json(properties);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//UPDATE PROPERTY
exports.updatePropertyStatus = async (req,res) => {
  try{
    const { propertyId, status } = req.body;
    const property = await Property.findById(propertyId);
    if(!property) return res.status(404).json({ message: 'Property not found' });

    property.status = status; // e.g., 'available','rented','sold'
    await property.save();
    res.status(200).json(property);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
}


// exports.getProperty = async (req,res) => {
//   try{
//     const filters = {};
//     if(req.query.location) filters.location = req.query.location;
//     if(req.query.type) filters.type = req.query.type;
//     if(req.query.price) filters.price = { $lte: req.query.price };

//     const properties = await Property.find(filters);
//     res.status(200).json(properties);
//   } catch(err){
//     res.status(500).json({ message: err.message });
//   }
// };

//DELETE PROPERTIES
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!property.owner) {
      return res.status(400).json({ message: "Property has no owner" });
    }

    // Convert safely
    const ownerId = property.owner.toString();
    const userId = req.user._id.toString();

    if (ownerId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();
    res.status(200).json({ message: "Property deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


