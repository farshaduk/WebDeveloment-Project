const express = require('express');
const {requiresignin} = require('../controllers/Auth');
const {userById , allUsers,getUser,
       updateUser,deleteUser} = require('../controllers/User');


const router = express.Router();

router.get("/users", allUsers );
router.get("/user/:userId", requiresignin, getUser );
router.put("/user/:userId", requiresignin, updateUser );
router.delete("/user/:userId", requiresignin, deleteUser );
//any route containing userId app will first execute UserById function
router.param("userId",userById);



module.exports = router;