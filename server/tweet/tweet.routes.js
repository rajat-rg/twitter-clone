const router = require("express").Router();
const fetchUser = require("../utils/fetchUser");
const Tweet = require("./tweet.model");
const User = require("../auth/auth.model");
router.post("/tweet", fetchUser, async (req, res) => {
  const { tweet } = req.body;
  const newTweet = new Tweet({ user: req.user.id, tweet });
  const r = await newTweet.save();
  if (r) {
    res.status(200).json({ message: "Tweet posted", success: true });
  } else {
    res.status(400).json({ message: "Tweet failed", success: false });
  }
});
router.get("/fetchTweet-user", fetchUser, async (req, res) => {
  const myTweets = await Tweet.find({ user: req.user.id });
  if (myTweets) {
    res
      .status(200)
      .json({ tweets: myTweets, message: "Tweets fetched", success: true });
  } else {
    res.status(404).send({ message: "Failed to fetch tweets", success: false });
  }
});
router.get("/id",fetchUser, async (req, res) => {
  const myTweets = await Tweet.findById(req.query.id);
  const reply = await Tweet.find({ parentTweet: req.query.id });

  if (myTweets) {
    res
      .status(200)
      .json({
        tweet: myTweets,
        reply,
        message: "Tweets fetched",
        success: true,
      });
  } else {
    res.status(404).send({ message: "Failed to fetch tweets", success: false });
  }
});
router.get("/user",fetchUser, async (req, res) => {
  const user = await User.find({ username: req.query.user });
  if (user) {
    if (user.length === 0) {
      res
        .status(200)
        .json({ message: "Username not found", success: false });
    } else {
      const tweets = await Tweet.find({ user: user[0]._id });
      res
        .status(200)
        .json({ user, tweets, message: "User details fetched", success: true });
    }
  } else {
    res.status(404).send({ message: "Failed to fetch tweets", success: false });
  }
});
router.get('/like',fetchUser, async(req,res)=>{
    const tweet = await Tweet.findByIdAndUpdate(req.query.id, {like:like+1})
    if(tweet)
    {
        res.status(200).json({message:'liked', success:true})
    }else{
        res.status(404).json({message:'tweet not found', success:false})
    }

})
module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxODNhMWNmNTRhMGY5MjdlNmRlODdmIn0sImlhdCI6MTY3OTMwOTU0Mn0.Fp99H-gBZ5fbvXm1oJ4pBGJPKE0kUv89prUGIdqSr-k
