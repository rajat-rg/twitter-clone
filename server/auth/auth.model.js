const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  email: { type: String, required: true, unique:true },
  doj: { type: Date, required: true, default: Date.now() },
  bio: { type: String, maxLength: 120 },
  isVerified: { type: Boolean, required: true, default: false },
  following: { type: Object },
  followers: { type: Object },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
