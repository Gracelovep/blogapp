// Custom error class carrying an HTTP status code, so the central error
// handler can translate it into the standard { success: false, error } shape.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
