const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String },
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Date, default: Date.now() + 3600000 },
});

const VerifyModel = mongoose.model("OTP", verificationSchema);
module.exports = VerifyModel;
