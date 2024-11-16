const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./config/db");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDb();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
