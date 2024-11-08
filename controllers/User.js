const _ = require('lodash')
const User= require('../Models/user');

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
      let user = req.profile;
      user = _.extend(user, req.body);
      user.updatedddate = Date.now();
      await user.save();       
      user.hashed_password = undefined;
      user.salt = undefined;      
      res.json({ user });
      next();
   } catch (err) {
      return res.status(400).json({ error: "You are not authorized to perform this action" });
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