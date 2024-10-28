
const express = require('express');
const {getPost,createPost} = require('../controllers/post');
const {createPostValidator} = require('../Validators')

const router = express.Router()

router.get('/',getPost )
router.post('/post',createPostValidator ,createPost )


module.exports = router;