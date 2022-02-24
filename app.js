const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
//database configuration
require("./database/mongoDB");

// routes

const adminRouter = require("./routes/admins");
const chapterRouter = require("./routes/chapters");
const courseCommentsRouter = require("./routes/courseComments");
const courseRouter = require("./routes/courses");
const invoiceDetailsRouter = require("./routes/invoiceDetails");
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

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", usersRouter);
app.use("/teachers", usersRouter);
app.use("/students", usersRouter);
app.use("/courses", usersRouter);
app.use("/reclamations", usersRouter);
app.use("/products", usersRouter);
app.use("/sellers", usersRouter);
app.use("/product_reviews", usersRouter);
app.use("/invoices", usersRouter);
app.use("/chapters", usersRouter);
app.use("/course_comments", usersRouter);
app.use("/resources", usersRouter);
app.use("/chapters", usersRouter);

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
