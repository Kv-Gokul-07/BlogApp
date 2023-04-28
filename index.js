import express  from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import multer from "multer";
import fs from "fs";
import jwt from "jsonwebtoken";

import AuthRoutes from "./routes/Auth.js";
import Post from "./models/Post.js";
import PostRoutes from "./routes/Post.js";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
dotenv.config();
const uploadMiddleware = multer({ dest: 'uploads/'}); 
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);


app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirName + '/uploads/'));

// Routes
app.use("/auth", AuthRoutes);
app.use("/home", PostRoutes);


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {

  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const {title, summary, content} = req.body;
    const postDoc = await Post.create({
      title, 
      summary,
      content,
      cover: newPath,
      author: info.id,
    })
    console.log(info, postDoc)

    res.json(postDoc);
  });

})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {

    let newPath = null;
    if(req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
       newPath = path + '.' + ext;
      fs.renameSync(path, newPath); 
    }

    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
      if (err) throw err;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if(!isAuthor) {
        res.status(400).json('You are not the author');
      }

      await postDoc.update({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover})
      // const {title, summary, content} = req.body;
      // const postDoc = await Post.create({
      //   title, 
      //   summary,
      //   content,
      //   cover: newPath,
      //   author: info.id,
      // })
  
      res.json(postDoc);
    });
})

/* MONGO SETUP */
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_BASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
  })
  .catch((error) => console.error(`${error} did not connected`));
