const User = require("./auth.model");
const OTP = require("./verification.model");
const { body, validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
const { genSalt, hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { sendMail } = require("../utils/sendMail");

const checkUser = async (email, username) => {
  success = false;
  const ifE = await User.findOne({ email });
  const ifU = await User.findOne({ username });
  if (ifE && ifU) {
    return {
      message: "Email and Username already exits",
      success,
    };
  } else {
    if (ifE) {
      return {
        message: "Email already exits",
        success,
      };
    } else if (ifU) {
      return {
        message: "Username already exits",
        success,
      };
    }
  }
  return { message: "OK", success: true };
};

const sendOTP = async (email) => {
  const otp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const salt = await genSalt(10);
  const secOTP = await hash(otp, salt);
  await OTP.deleteMany({ email });
  await OTP.create({ email, otp: secOTP });

  sendMail(
    email,
    "Twitter OTP verification",
    `<h1>Welcome to Twitter</h1><br> <h2>Your OTP is <b style="color:blue;">${otp}</b> and it will expire in 1 hour </h2>`
  );
};

router.post(
  "/sign-up",
  [
    body("email").isEmail().withMessage("Provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chars long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      success = false;
      const { name, email, password, cPassword, username } = req.body;

      const ifU = await checkUser(email, username);
      if (!ifU.success) {
        res.send(ifU);
      } else {
        if (password !== cPassword) {
          res.send({
            message: "Password not matched",
            success,
          });
        }
        await sendOTP(email);
        res.send({ message: "OTP sent successfully", success: true });
      }
    } catch (error) {
      console.log(error);
      res.send({ message: "Internal server error", error, success: false });
    }
  }
);

router.post("/sign-up/verify", async (req, res) => {
  try {
    const { name, email, password, username } = req.headers;
    const salt = await genSalt(10);
    const otp = req.body.otp;
    const findOTP = await OTP.find({ email });
    if (findOTP.length <= 0) {
      res.send({
        message: "Email not found or already verified",
        success: false,
      });
    } else {
      const myOTP = findOTP[0];
      if (myOTP.expiresAt < Date.now()) {
        res.send({ message: "OTP has expired", success: false });
      } else {
        const r = compare(otp, myOTP.otp);
        if (r) {
          const secPass = await hash(password, salt);
          const newUser = await User.create({
            name,
            email,
            password: secPass,
            username,
          });
          await OTP.deleteMany({ email });
          const data = {
            user: {
              id: newUser.id,
            },
          };
          const authtoken = jwt.sign(data, process.env.JWT_SECRET);
          success = true;
          res.json({ success, authtoken });
        } else {
          res.send({ message: "Invalid OTP", success: false });
        }
      }
    }
    // res.send('hello')
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal server error", error, success: false });
  }
});

router.post("/sign-up/resend", async (req, res) => {
  try {
    const email = req.headers.email;
    await sendOTP(email);
    res.send({ message: "OTP resent", success: true });
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal server error", error, success: false });
  }
});
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 chars long"),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      success = false;
      if (!email || !password) {
        res.send({ message: "Empty email or password", success });
      } else {
        const u = await User.findOne({ email });
        if (!u) {
          res.send({ message: "User not found with this email", success });
        } else {
          const p = await compare(password, u.password);
          if (p) {
            const data = {
              user: {
                id: u.id,
              },
            };
            const authtoken = jwt.sign(data, process.env.JWT_SECRET);
            success = true;
            res.json({ success, authtoken, message: "login success" });
          } else {
            res.send({ message: "Wrong password" });
          }
        }
      }
    } catch (error) {
      console.log(error);
      res.send({ message: "Internal server error", error, success: false });
    }
  }
);

router.get("/", (req, res) => {
  res.send("auth route");
});


module.exports = router;
