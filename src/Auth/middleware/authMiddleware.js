const jwt = require("jsonwebtoken");
const user = require("../../model/user");
const dotenv = require("dotenv");
dotenv.config();

exports.protect = async (req,res,next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
    console.log("Headers received:", req.headers);
    console.log(" Token received:", token);
  }
  if(!token) return res.status(401).json({ message: 'Not authorized' });

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Decoded token:", decoded);
    req.user = await user.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch(err){
     console.error(" Token error:", err.message);
    res.status(401).json({ message: 'Token invalid' });
  }
}
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You don't have permission" });
    }
    next();
  };
}