/**
 * Middleware function to check if the request body has the required properties.
 *
 * @param {...string} properties - The names of the required properties.
 * @returns {Function} - Returns an Express middleware function.
 */
function hasProperties(...properties) {
  return function (req, res, next) {
    // Destructure the data object from the request body.
    // If not provided, default to an empty object.
    const { data = {} } = req.body;

    try {
      // For each required property, check if it exists in the data object.
      properties.forEach((property) => {
        // If the property does not exist in the data object, throw an error.
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });

      // If all properties exist, call the next middleware or route handler.
      next();
    } catch (error) {
      // If there's an error (i.e., a missing property), pass the error to the next middleware.
      next(error);
    }
  };
}

// Export the hasProperties function for use in other files.
module.exports = hasProperties;
