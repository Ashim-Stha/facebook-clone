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
      // secure: true,
      // sameSite: "None",
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, "User not found");
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return response(res, 404, "Invalid password");
    }

    const accessToken = generateToken(user);
    res.cookie("auth_token", accessToken, {
      httpOnly: true,
    });

    return response(res, 201, "User logged in successfully", {
      username: user.username,
      email: user.email,
    });
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};

const logout = (req, res) => {
  try {
    res.cookie("auth_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return response(res, 200, "User logged out successfully");
  } catch (e) {
    console.error(e);
    return response(res, 500, "Internal Server Error", e.message);
  }
};
module.exports = { registerUser, loginUser, logout };
