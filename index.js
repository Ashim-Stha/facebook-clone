const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./config/db");
const passport = require("./controllers/googleController");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const messagesRoute = require("./routes/messagesRoute");
const setupSocket = require("./config/socket");

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/uploads", express.static("/uploads"));

connectDb();
app.use(passport.initialize());

//api routes
app.use("/auth", authRoute);
app.use("/users", postRoute);
app.use("/users", userRoute);
app.use("/users", messagesRoute);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`server listening on ${PORT}`)
);
setupSocket(server);
