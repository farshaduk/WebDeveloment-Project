const express = require('express');
const {requiresignin ,requiresigninLog} = require('../controllers/Auth');
const {userById , allUsers,getUser,
       updateUser,deleteUser,verifypassword} = require('../controllers/User');

const { validatePasswordUpdate } = require('../Validators/index');

const router = express.Router();

router.get("/users", allUsers );
router.get("/user/:userId", requiresignin, userById,  getUser);
router.get("/user/:userId", requiresignin, getUser );
router.put("/user/:userId", requiresignin,validatePasswordUpdate, updateUser );
router.delete("/user/:userId", requiresignin, deleteUser );
router.post("/user/verifypassword", requiresignin, verifypassword );
//any route containing userId app will first execute UserById function
router.param("userId",userById);

module.exports = router;