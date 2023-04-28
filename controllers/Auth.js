import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { userName, userPswd } = req.body;
    const newUser = new User({ userName, userPswd });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, userPswd } = req.body;
    const user = await User.findOne({ userName: userName });

    if (user) {

      //logged in
      jwt.sign({userName, id: user._id}, process.env.JWT_SECRET_KEY, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).status(200).json({
          id: user._id,
          userName
        });
      })

    } else {
      return res.status(400).json({ msg: "User does not exist." });
    }
  } catch (err) {
    res.status(500).json({ error: "User Already Exists" });
  }
};

export const userProfile = async (req, res) => {
  // req.cookies.title='TutorialsPoint';

  // console.log(req.cookies)
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

export const logout = async (req, res) => {
  res.cookie("token", " ").status(200).json("ok");
};
