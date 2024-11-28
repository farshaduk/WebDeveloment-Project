const express = require('express');
const {SignUp , signin , signout} = require('../controllers/Auth');
const {userById} = require('../controllers/User');
const {UserSignUpValidator} = require('../Validators');

const router = express.Router();
router.post('/signup', UserSignUpValidator, SignUp );
router.post('/signin', signin );
router.get('/signout', signout );

//any route containing userId app will first execute UserById function
router.param("userId",userById);



module.exports = router;