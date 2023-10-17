/**
 * Middleware function to handle HTTP methods that are not allowed.
 * This is typically used for routes that don't support a particular HTTP method.
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {function} next - The Express next middleware function
 */
function methodNotAllowed(req, res, next) {
  // Pass an error to the next middleware with a 405 status (Method Not Allowed)
  // and a message indicating the method and route that is not allowed.
  next({
    status: 405,
    message: `${req.method} not allowed for ${req.originalUrl}`,
  });
}

// Export the middleware function for use in other parts of the application.
module.exports = methodNotAllowed;
