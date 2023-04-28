import Post from "../models/Post.js";

export const fetchingPosts = async (req, res) => {
    try {
        const posts =  await Post.find().populate('author', ['userName']).
        sort({createdAt: - 1}).
        limit(20);
        res.status(200).json({posts})
     } catch (err) {
        res.status(500).json({ error: "No POSTS Exists" });
      }
}

export const individualPost = async (req, res) => {

  const { id } = req.params;
 const postDoc = await  Post.findById(id).populate('author', ['userName']);
   res.json({postDoc})
}