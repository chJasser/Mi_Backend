require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const app = express();
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cookieSession = require("cookie-session");
const cors = require("cors");
const flash = require("connect-flash");
/**
 *
 *
 * cors config
 *
 */
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
//database configuration
require("./database/mongoDB");
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// makes the folder public 
app.use('/uploads', express.static('uploads'));
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
// routes

const authenticationRouter = require("./routes/authentication");
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
const teacherRouter = require("./routes/teachers");
const usersRouter = require("./routes/users");
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
//passport & session  config
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
require("./middleware/passportAuth")(passport);
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
//routes
// app.use("/auth", authRouter);
app.use("/authentication", authenticationRouter);
app.use("/admins", adminRouter);
app.use("/teachers", teacherRouter);
app.use("/students", studentRouter);
app.use("/courses", courseRouter);
app.use("/reclamations", reclamationRouter);
app.use("/products", productRouter);
app.use("/sellers", sellerRouter);
app.use("/product_reviews", productReviewsRouter);
app.use("/invoice_details", invoiceDetailsRouter);
app.use("/invoices", invoiceRouter);
app.use("/chapters", chapterRouter);
app.use("/courseComments", courseCommentsRouter);
app.use("/resources", resourceRouter);
app.use("/chapters", chapterRouter);
app.use("/users", usersRouter);
app.use("/uploads", express.static("uploads"));
/*
**
**
**
**



***
***
***
***/
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
