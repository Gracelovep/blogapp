// Standard success envelope used by every route:
// { success: true, data, message }
const sendSuccess = (res, statusCode, data, message) => {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
};

module.exports = sendSuccess;
