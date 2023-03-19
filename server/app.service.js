const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const middleware = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(cors);
  dotenv.config();
};

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
};
module.exports = { middleware, connectDB };

//rg45 s kcl4ZeMcV9GnC39K
