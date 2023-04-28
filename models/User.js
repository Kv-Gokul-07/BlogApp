import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true, min:4, unique: true },
    userPswd: { type: String, required: true }
})

const User = mongoose.model('User', UserSchema);

export default User;