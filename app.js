const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
//database configuration
require("./database/mongoDB");

//routes
 

const app = express();

// view engine setup


// routes

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

const app = express();


app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


app.use("/admin", adminRouter);
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
