
import express from "express";

import { fetchingPosts, individualPost } from "../controllers/Post.js";

const router = express.Router();

router.get("/post", fetchingPosts);
router.get("/post/:id", individualPost);

export default router;