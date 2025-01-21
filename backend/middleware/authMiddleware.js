const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler");

const authMiddleware = (req, res, next) => {
  const authToken = req?.cookies?.auth_token;
  if (!authToken) {
    return response(res, 401, "Authentication required.Please provide token");
  }

  try {
    const decode = jwt.decode(authToken, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (e) {
    console.error(e);
    return response(res, 401, "Invalid token or expired.Please try again");
  }
};

module.exports = authMiddleware;
