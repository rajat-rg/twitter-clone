const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token)
      res.json({ message: "Login with valid credentials", success: false });
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.json({ message: "Internal server error", error });
  }
};

module.exports = fetchUser;
