const response = (res, statusCode, message, data = null) => {
  const responseObj = {
    status: statusCode < 400 ? "success" : "error",
    message,
    data,
  };

  return res.status(statusCode).json(responseObj);
};

module.exports = response;
