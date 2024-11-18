const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./config/db");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDb();

//api routes
app.use("/auth", authRoute);
app.use("/users", postRoute);
app.use("/users", userRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
