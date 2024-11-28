const formidable = require('formidable');
const fs = require('fs');
const Post= require('../Models/post');
const _ = require ('lodash');


exports.postById = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id).populate("postedBy", "_id name").exec();
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    req.post = post;
    next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


exports.getPost = async (req, res)=> {
   const posts= Post.find().populate("postedBy","_id name")
   .select("_id title body ")
   .then((posts)=>{
    res.json({ posts: posts });
   })
   .catch(err => console.log(err));
};

exports.createPost = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }
// Convert fields to strings if they are arrays
fields.title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
fields.body = Array.isArray(fields.body) ? fields.body[0] : fields.body;

 // Create a new Post instance with parsed fields
  const post = new Post(fields);
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  post.postedBy = req.profile;

   // Handle photo file if provided
   if (files.photo) {
    post.photo.data = fs.readFileSync(files.photo.path);
    post.photo.contentType = files.photo.type;
  }
  try {
    const result = await post.save();
    res.status(200).json({ post: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

};


exports.getPostsByUser = async (req, res) => {
  try {
    // Fetch posts using async/await
    const posts = await Post.find({ postedBy: req.profile._id })
                            .populate("postedBy", "_id name")
                            .sort("_created");

    // Send the response with the fetched posts
    res.json({ posts });
  } catch (err) {
    // Handle any errors that occur during the fetch
    res.status(400).json({ error: err.message });
  }
};

exports.isPoster = async (req, res, next) => {
  try {
    const isPoster =
      req.post && req.auth && String(req.post.postedBy._id) === String(req.auth._id);

    if (!isPoster) {
      return res.status(403).json({ error: "User is not authorized" });
    }

    next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const post = req.post;

    // Use deleteOne() to remove the document
    await Post.deleteOne({ _id: post._id });

    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = req.post;

    // Use lodash to update the post object with new data from req.body
    post = _.extend(post, req.body);
    post.updatePost= Date.now()

    // Save the updated post    
    const updatedPost = await post.save();

    return res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};