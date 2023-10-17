/**
 * Middleware function to handle errors thrown in Express routes.
 *
 * @param {Object} error - The error object passed from previous middleware or route handlers.
 * @param {Object} request - The Express request object.
 * @param {Object} response - The Express response object.
 * @param {Function} next - The next middleware function in the Express middleware chain.
 */
function errorHandler(error, request, response, next) {
  // Destructure the status and message from the error object.
  // If they're not provided, default values are set.
  const { status = 500, message = "Something went wrong!" } = error;

  // Send the error status and message as a JSON response to the client.
  response.status(status).json({ error: message });
}

// Export the error handler middleware for use in other files.
module.exports = errorHandler;
