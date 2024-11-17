const User = require("../model/User");
const response = require("../utils/responseHandler");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");
const registerUser = async (req, res) => {
  try {
    const { username, email, password, gender, dateOfBirth } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
    });

    const accessToken = generateToken(newUser);
    res.cookie("auth_token", accessToken, {
      httpOnly: true,
    });

    await newUser.save();

    return response(res, 201, "User created successfully", {
      username: newUser.username,
      email: newUser.email,
    });
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};

module.exports = { registerUser };
