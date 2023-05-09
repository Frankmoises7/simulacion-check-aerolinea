const express = require("express");
const path = require("path");
const morgan = require("morgan");

const router = require("../router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

module.exports = app;