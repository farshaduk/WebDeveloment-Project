const jwt = require('jsonwebtoken');
require('dotenv').config();
const { expressjwt } = require("express-jwt");
const User= require('../Models/user');

exports.SignUp = async (req, res) => {

  const { name, lastname, email, password } = req.body;
   // Validate required fields
   if (!name || !lastname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

    const userExists = await User.findOne({email:req.body.email})
    if(userExists) return   res.status(403).json({ 
      error: "this email is registered before please login"
     })  

    const user = new User({ name, lastname, email, password });  
    try {
      const result = await user.save();
      res.status(200).json({ message: "SignUp success! Please Login" });
  } catch (err) {
      res.status(400).json({ error: err });
  }  
};

exports.signin =async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }
     // generate a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Return the token to the client
     res.cookie("t",token);
     const {_id,name, email: userEmail ,createddate } = user
    return res.json({ token , user: {_id, name, email: userEmail ,createddate}});
      
  } catch (error) {
    res.status(400).json({ error: 'Error signing in' });
  }

};

exports.signout =async (req, res) =>{

  res.clearCookie("t");
  // Send a success response
  return res.json({ message: "Signout successful!" });
}


exports.requiresignin = expressjwt({
  //if the token is valid, expressjwt appends verified user id in an auth key to request object
  secret: process.env.JWT_SECRET,
  algorithms:  ["HS256"], 
  userProperty: "auth",
  requestProperty: "auth",
});

// exports.requiresignin = expressjwt({
//   secret: process.env.JWT_SECRET, // JWT secret key
//   algorithms: ["HS256"], // Algorithm used to sign the token
//   userProperty: "auth", // Attach the decoded token payload to `req.auth`
//   requestProperty: "auth", // Ensure `req.auth` contains the token details
//   getToken: (req) => {
//     // Extract token from Authorization header
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.split(" ")[0] === "Bearer"
//     ) {
//       return req.headers.authorization.split(" ")[1];
//     }
//     return null; // No token provided
//   },
// });

// Error handler for JWT
exports.jwtErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "invalid user, please login first..." });
  }
  next();
};

// Error handler for JWT-related issues
exports.jwtErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
  next();
};





exports.requiresigninLog = (req, res, next) => {
  console.log("requiresignin executed, req.auth:", req.auth);
  next();
};