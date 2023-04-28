import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { type: String },
    summary: { type: String },
    content: { type: String },
    cover: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true})

const Post = mongoose.model('Post', PostSchema);

export default Post;