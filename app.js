require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const app = express();

// Set up mongoose
const mongoose = require("mongoose");
const mongoDB = process.env.MONGO_URL;
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", postsRouter);
app.use("/api", commentsRouter);

// JSON Web Token
app.post("/api/login", async (req, res, next) => {
  const {username, password} = req.body
  const DBUser = await User.findOne({username});
  const passwordMatch = await bcrypt.compare(password, DBUser.password);
  if (DBUser && passwordMatch) {
    jwt.sign({username, password}, process.env.JWT_KEY, (err, token) => {
      if (err) {
        console.error("Error generating token:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.send({ token });
      }
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
