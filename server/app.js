const express = require("express");
const { middleware, connectDB } = require("./app.service");
const app = express();
const port = 5000;
middleware(app);
connectDB();

app.get("/", (req, res) => {
  console.log("hi");
  res.send("Hello there.");
});

// routes for authentication
// http://localhost:5000/auth
app.use('/auth',require('./auth'))
app.use('/tweet',require('./tweet'))

app.listen(port, () => {
  console.log("Server up at port ", port);
});
