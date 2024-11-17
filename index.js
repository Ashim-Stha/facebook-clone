const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./config/db");
const authRoute = require("./routes/authRoute");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDb();

//api routes
app.use("/auth", authRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
