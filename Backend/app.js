// app.js
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { config } = require("dotenv");
const DbConnect = require("./database/db");
const userRoute = require("./routes/user.routes");
const messageRoute = require("./routes/message.routes");
const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
DbConnect();

module.exports = app;
