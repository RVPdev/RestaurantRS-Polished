/**
 * Middleware function to handle requests to unknown routes.
 * If a request hits this middleware, it means no prior route or middleware
 * has handled or responded to this request, thus it's considered as "Not Found".
 *
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {function} next - The Express next middleware function
 */
function notFound(req, res, next) {
  // Pass an error to the next middleware with a 404 status (Not Found)
  // and a message indicating the route that was not found.
  next({ status: 404, message: `Path not found: ${req.originalUrl}` });
}

// Export the middleware function for use in other parts of the application.
module.exports = notFound;
