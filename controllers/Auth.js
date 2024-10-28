const jwt = require('jsonwebtoken');
require('dotenv').config();
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
     const {_id,name, email: userEmail } = user
    return res.json({ token , user: {_id, name, email: userEmail}});
      
  } catch (error) {
    res.status(400).json({ error: 'Error signing in' });
  }

};

exports.signout =async (req, res) =>{

  res.clearCookie("t");
  // Send a success response
  return res.json({ message: "Signout successful!" });
}