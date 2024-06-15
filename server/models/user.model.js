import mongoose from "mongoose";
import Collections from "../constants/collection.js";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    registration_date: { type: Date, default: Date.now },
    last_login_date: { type: Date, default: null },
  },
  { versionKey: false }
);

const UserModel = mongoose.model(Collections.USER, userSchema, "user");
export default UserModel;
