const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const members = require("./routes/memberRoutes.js");
const committee = require("./routes/committeeRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const utilityRoute = require("./routes/utilityRoute");

const {notFoundHandler, errorHandler} = require("./middlewares/errorHandler");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

//middleWares
app.use(cors());
app.use(express.json());

// view engine setup
app.set("view engine", "ejs");

// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/members", members);
app.use("/api/v1/committee", committee);
app.use("/api/v1/events", eventsRoutes);

app.use("/api/v1/utils", utilityRoute);

app.use(
    "/avatars",
    express.static(path.join(__dirname, "public/uploads/avatars"))
);
app.use("/public", express.static(path.join(__dirname, "public")));

// This is only for development purpose, remove before production
app.get("/view/:page", (req, res) => {
    const vars = req.query;
    res.render(req.params.page, vars);
});

app.get("/", (req, res) => {
    res.send("Hello EveryOne!");
});
// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
