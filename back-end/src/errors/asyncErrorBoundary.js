/**
 * Middleware to handle errors in asynchronous routes and pass them to the next middleware.
 *
 * @param {Function} delegate - The asynchronous function (typically a route handler) that this middleware wraps around.
 * @param {number} defaultStatus - The default status code to use if the error object doesn't provide one.
 * @returns {Function} The middleware function to handle errors in the provided asynchronous function.
 */
function asyncErrorBoundary(delegate, defaultStatus) {
  return (request, response, next) => {
    // Use Promise.resolve to handle the result of the asynchronous function.
    Promise.resolve()

      // Call the delegate function (asynchronous route handler).
      .then(() => delegate(request, response, next))

      // If there's an error in the delegate function, catch it.
      .catch((error = {}) => {
        // Destructure the status and message from the error object.
        // If they're not provided, use the defaultStatus and the entire error object.
        const { status = defaultStatus, message = error } = error;

        // Call the next middleware with the error information.
        next({
          status,
          message,
        });
      });
  };
}

// Export the middleware for use in other files.
module.exports = asyncErrorBoundary;
