
const express = require('express');
const {getPost,createPost} = require('../controllers/post');
const {requiresignin} = require('../controllers/Auth');
const {userById} = require('../controllers/User');
const {createPostValidator} = require('../Validators')

const router = express.Router();

router.get('/',getPost );
router.post('/post',requiresignin,createPostValidator ,createPost );

//any route containing userId app will first execute UserById function
router.param("userId",userById);

module.exports = router;


