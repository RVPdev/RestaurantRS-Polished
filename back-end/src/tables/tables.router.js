// Import required modules and controllers
const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Define routes for handling table seating
// PUT: Update the table with a new reservation (i.e., seat the reservation at the table)
// DELETE: Remove the reservation from the table
// Any other methods will trigger a "Method Not Allowed" error
router
  .route("/:tableId/seat")
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

// Define routes for individual tables by tableId
// GET: Fetch the details of a specific table by its ID
// Any other methods will trigger a "Method Not Allowed" error
router.route("/:tableId").get(controller.read).all(methodNotAllowed);

// Define root routes for tables
// GET: List all tables
// POST: Create a new table
// Any other methods will trigger a "Method Not Allowed" error
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

// Export the router for use in the application
module.exports = router;
