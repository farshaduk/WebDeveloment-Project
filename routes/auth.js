const express = require('express');
const {SignUp , signin , signout} = require('../controllers/Auth');
const {UserSignUpValidator} = require('../Validators');

const router = express.Router();
router.post('/signup', UserSignUpValidator, SignUp );
router.post('/signin', signin );
router.get('/signout', signout );
module.exports = router;