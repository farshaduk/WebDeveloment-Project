const formidable = require('formidable');
const express = require('express');
const {getPost,createPost,getPostsByUser,postById,
    isPoster,deletePost,
    updatePost,postPhoto,getPostdetails} = require('../controllers/post');
const {requiresignin} = require('../controllers/Auth');
const {userById} = require('../controllers/User');
const {createPostValidator} = require('../Validators')

const router = express.Router();


router.get('/posts',getPost );
router.get('/post/:postId',getPostdetails );
router.get('/post/photo/:postId', postPhoto);
router.post('/post/new',requiresignin,createPost,createPostValidator );
router.get('/posts/by/:userId',requiresignin,getPostsByUser );
router.delete('/post/:postId',requiresignin,isPoster,deletePost);
router.put('/post/:postId',requiresignin,isPoster,updatePost);
//any route containing userId app will first execute UserById function
router.param("userId",userById);
//any route containing postById app will first execute postById function
router.param("postId",postById);

module.exports = router;


