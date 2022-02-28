const createError = require("http-errors");
const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
//database configuration
require("./database/mongoDB");
const passport = require("passport");
const session = require("express-session");

require("./middleware/passport");

// routes
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admins");
const chapterRouter = require("./routes/chapters");
const courseCommentsRouter = require("./routes/courseComments");
const courseRouter = require("./routes/courses");
const invoiceDetailsRouter = require("./routes/invoiceDetails");
const productImagesRouter = require("./routes/productImages");
const invoiceRouter = require("./routes/invoices");
const productReviewsRouter = require("./routes/productReviews");
const productRouter = require("./routes/products");
const reclamationRouter = require("./routes/reclamations");
const resourceRouter = require("./routes/resources");
const sellerRouter = require("./routes/sellers");
const studentRouter = require("./routes/students");
const superAdminRouter = require("./routes/superAdmins");
const teacherRouter = require("./routes/teachers");
const usersRouter = require("./routes/users");

//passport & session  config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


//logging middleware
app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/admins", adminRouter);
app.use("/teachers", teacherRouter);
app.use("/students", studentRouter);
app.use("/courses", courseRouter);
app.use("/reclamations", reclamationRouter);
app.use("/products", productRouter);
app.use("/sellers", sellerRouter);
app.use("/product_reviews", productReviewsRouter);
app.use("/invoices", invoiceRouter);
app.use("/chapters", chapterRouter);
app.use("/courseComments", courseCommentsRouter);
app.use("/resources", resourceRouter);
app.use("/chapters", chapterRouter);
app.use("/productImages", productImagesRouter);
app.use("/users", usersRouter);

app.use("/", (req, res) => {
  res.send("welcome to MI universe!");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
});

module.exports = app;
