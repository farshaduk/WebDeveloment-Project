const _ = require('lodash')
const User= require('../Models/user');
const { validatePasswordUpdate } = require('../Validators/index');

exports.userById = async (req, res, next, id) => {   
   try {
      const user = await User.findById(id);
      if (!user) {
         return res.status(400).json({ error: "User not found" });
      }
      req.profile = user;
      next(); // Proceed to the next middleware if the user is found
   } catch (err) {     
      res.status(500).json({ error: "Server error while finding user" });
   }
};


 exports.hasAuthorization = async (req, res, next) => {
   try {
      const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
      if (!authorized) {
         return res.status(403).json({ error: "User is not authorized" });
      }
      next(); // Proceed to the next middleware if authorized
   } catch (error) {
      res.status(500).json({ error: "Authorization check failed" });
   }
};

exports.allUsers = async (req, res) => {
   try {
      const users = await User.find().select("name email createddate");
      res.json({ users });
   } catch (err) {
      res.status(400).json({ error: err.message });
   }
};

exports.getUser = async (req, res) => {
   req.profile.hashed_password = undefined
   req.profile.salt = undefined
   return res.json(req.profile);
};

exports.updateUser = async (req, res, next) => {
   try {

      if (req.body.newPassword) {
         const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
         if (!passwordPolicy.test(req.body.newPassword)) {
            return res.status(400).json({
               error:
                  "Password must be 8-32 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
            });
         }
      }
      
      let user = req.profile;

      // Update other fields
      user = _.extend(user, req.body);
      user.updatedddate = Date.now();

      // Handle password change
      if (req.body.newPassword) {
         user.password = req.body.newPassword; // This invokes the virtual setter for password
      }

      await user.save();
      user.hashed_password = undefined; // Remove sensitive data from response
      user.salt = undefined;
      
      res.json({ user });
      next();
   } catch (err) {
      console.error("Error updating user:", err);
      return res.status(400).json({ error: "You are not authorized to perform this action" });
   }
};


exports.verifypassword = async (req, res) => {
   const { currentPassword } = req.body;
 
   try {
     // Find user by the authenticated ID
     const user = await User.findById(req.auth._id); // req.auth._id from requiresignin middleware
 
     if (!user) {
       console.error("User not found");
       return res.status(404).json({ success: false, message: "User not found" });
     }
 
     console.log("User fetched for verification:", user); // Debug
 
     // Compare the provided password with the stored hash
     const isMatch = user.comparePassword(currentPassword);
 
     console.log("Password match result:", isMatch); // Debug
 
     if (!isMatch) {
       return res.status(400).json({ success: false, message: "Incorrect password" });
     }
 
     return res.status(200).json({ success: true, message: "Password verified" });
   } catch (error) {
     console.error("Error in verifypassword:", error); // Debug
     return res.status(500).json({ success: false, message: "Server error" });
   }
 };
 
 
 


exports.deleteUser = async (req, res) => {
   try {
      let user = req.profile;           
      await user.deleteOne(); 
      
      res.json({ message: "User deleted successfully" });
   } catch (err) {
      return res.status(400).json({ error: err.message || "Error deleting user" });
   }
};