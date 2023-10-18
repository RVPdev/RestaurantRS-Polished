/**
 * Defines the router for reservation resources.
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Routing for reservations based on their status.
router
  .route("/:reservationId/status")
  // Updates the status of a reservation with a specific ID.
  .put(controller.update)
  // Deletes a reservation with a specific ID.
  .delete(controller.delete)
  // All other methods for this route are not allowed.
  .all(methodNotAllowed);

// Routing for a specific reservation based on its ID.
router
  .route("/:reservationId")
  // Retrieves a specific reservation based on its ID.
  .get(controller.read)
  // Updates a specific reservation based on its ID.
  .put(controller.updateRes)
  // All other methods for this route are not allowed.
  .all(methodNotAllowed);

// General routing for reservations.
router
  .route("/")
  // Lists all reservations.
  .get(controller.list)
  // Creates a new reservation.
  .post(controller.create)
  // All other methods for this route are not allowed.
  .all(methodNotAllowed);

module.exports = router;
