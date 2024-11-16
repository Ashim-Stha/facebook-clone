const User = require("../model/User");
const registerUser = async (req, res) => {
  try {
    const { username, email, password, gender, dateOfBirth } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
    }
  } catch (e) {}
};
