import express from "express";

import { login, logout, register, userProfile } from "../controllers/Auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", userProfile);
router.post("/logout", logout);

export default router;