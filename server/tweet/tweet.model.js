const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tweet: { type: String, required: true, maxLength: 280 },
  createdAt: { type: Date, required: true, default: Date.now() },
  parentTweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet", required: false },
  likes: { type: Number, default: 0 },
});

const TweetModel = mongoose.model("Tweet", tweetSchema);
module.exports = TweetModel;
