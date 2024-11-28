const Post= require('../Models/Contact');


exports.getPost = async (req, res)=> {
   const posts= Post.find().select("_id firstname lastname email ")
   .then((posts)=>{
    res.json({ posts: posts });
   })
   .catch(err => console.log(err));
};

exports.createPost = async (req, res) => {
  const PostExists = await Post.findOne({email:req.body.email})
    if(PostExists) return   res.status(403).json({ 
      error: "this email is registered before please login"
     })  

  const post = new Post(req.body);
  try {
    const result = await post.save();
    res.status(200).json({ post: result });
} catch (err) {
    res.status(400).json({ error: err });
}

};
