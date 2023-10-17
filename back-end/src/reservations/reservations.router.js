/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:reservationId/status")
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

// reservation id
router.route("/:reservationId").get(controller.read).put(controller.updateRes).all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
