// Custom error class to standardize error handling
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handling middleware function
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to the console for the developer
  console.error(err);

  // Handle specific error cases
  // Example: Postgres unique constraint violation
  if (err.code === "23505") {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Example: Postgres foreign key violation
  if (err.code === "23503") {
    const message = "Invalid reference key";
    error = new ErrorResponse(message, 400);
  }

  // Handle default error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = {
  ErrorResponse,
  errorHandler,
};
