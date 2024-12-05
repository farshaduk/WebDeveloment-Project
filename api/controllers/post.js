const formidable = require('formidable');
const fs = require('fs');
const Post= require('../Models/post');
const _ = require ('lodash');
const multer = require("multer");
const path = require('path');



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
   .select("_id title body created ")
   .then((posts)=>{
    res.json({ posts: posts });
   })
   .catch(err => console.log(err));
};


exports.createPost = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true; // Keep file extensions

  // Configure upload directory
  const uploadDir = path.join(__dirname, "../front-end/images");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  form.uploadDir = uploadDir;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(400).json({ error: "Error parsing form data" });
    }

    // Extract fields
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const body = Array.isArray(fields.body) ? fields.body[0] : fields.body;
    const postedBy = Array.isArray(fields.postedBy) ? fields.postedBy[0] : fields.postedBy;
    const photo = files.photo ? files.photo[0] : files.photo; // Handle file as an array or object

    // Validate fields
    if (!title || !body || !postedBy) {
      return res.status(400).json({ error: "Title, body, and postedBy are required." });
    }

    // Validate and handle photo
    let photoPath;
    if (photo && photo.filepath) {
      try {
        const photoExtension = path.extname(photo.originalFilename || photo.name); // Get file extension
        const newPhotoName = `${Date.now()}${photoExtension}`; // Generate unique filename
        photoPath = path.join(uploadDir, newPhotoName);

        // Move the file to the designated directory
        fs.renameSync(photo.filepath, photoPath);
      } catch (error) {
        console.error("Error handling photo:", error);
        return res.status(500).json({ error: "Error saving photo file." });
      }
    } else {
      return res.status(400).json({ error: "Photo is required." });
    }

    // Create a new post
    const post = new Post({
      title,
      body,
      postedBy, // Ensure this matches a valid ObjectId if linked to a User
      created: Date.now(),
      photo: {
        data: fs.readFileSync(photoPath), // Read photo data as Buffer
        contentType: photo.mimetype, // MIME type from the uploaded file
      },
    });
    try {
      // Save to database
      const savedPost = await post.save();
      return res.status(200).json({ message: "Post created successfully", post: savedPost });
    } catch (err) {
      console.error("Error saving post:", err);
      return res.status(500).json({ error: `An error occurred: ${err.message}` });
    }
  });
};

exports.getPostsByUser = async (req, res) => {
  try {
    // Fetch posts using async/await
    const posts = await Post.find({ postedBy: req.profile._id })
                            .populate("postedBy", "_id name")
                            .sort("created: -1");

                            if (!posts || posts.length === 0) {
                              return res.status(404).json({ error: "No posts found for this user" });
                            }
                        
                            return res.status(200).json(posts); // Return the posts
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    return res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};

exports.postPhoto = async (req, res, next) => {
  if (req.post && req.post.photo) {
    res.set("Content-Type", req.post.photo.contentType); // Set content type (e.g., image/jpeg)
    return res.send(req.post.photo.data); // Send binary image data
  } else {
    return res.status(404).json({ error: "Image not found" }); // Handle missing images
  }
};

exports.getPostdetails = async (req, res, next) => {
  try {
    const { postId } = req.params; // Extract postId from request parameters

    // Find the post by ID and populate the postedBy field
    const post = await Post.findById(postId)
      .populate("postedBy", "_id name") // Populate only specific fields of the user
      .exec();

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Return the post details
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post details:", error);
    return res.status(500).json({ error: "An error occurred while fetching post details" });
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