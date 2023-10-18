/**
 * List handler for reservation resources
 */
c; // Importing the service for reservations to interact with the database or perform business logic
const service = require("./reservations.service");

// Importing a utility function to handle asynchronous errors in Express routes
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Importing a utility function to check if the request body has specific properties
const hasProperties = require("../errors/hasProperties");

// Using the hasProperties function to create a new function that checks for
// the existence of the specified properties in the request body
const hasRequiredProperties = hasProperties(
  "first_name", // First name of the person making the reservation
  "last_name", // Last name of the person making the reservation
  "mobile_number", // Mobile number to contact the person making the reservation
  "reservation_date", // Date for the reservation
  "reservation_time", // Time for the reservation
  "people" // Number of people for the reservation
);

/// This function is responsible for listing reservations based on the request query parameters.
async function list(req, res, next) {
  // Extracting 'date' and 'mobile_number' from the request query parameters
  const { date, mobile_number } = req.query;

  // If 'date' is provided in the query, fetch reservations for that specific date
  if (date) {
    const data = await service.readDate(date); // Read reservations for the given date using the service
    res.json({ data: data }); // Respond with the fetched reservations
  }
  // If 'mobile_number' is provided, search for reservations with that mobile number
  else if (mobile_number) {
    const data = await service.search(mobile_number); // Search for reservations using the mobile number via the service
    res.json({ data: data }); // Respond with the found reservations
  }
  // If neither 'date' nor 'mobile_number' is provided, list all reservations
  else {
    const data = await service.list(); // Fetch all reservations using the service
    res.json({ data: data }); // Respond with all the reservations
  }
}

// This middleware function checks if a reservation with the given ID exists.
async function reservationExists(req, res, next) {
  // Attempt to fetch the reservation by its ID using the service
  const reservation = await service.read(req.params.reservationId);

  // If the reservation was found
  if (reservation) {
    res.locals.reservation = reservation; // Store the found reservation in the response's local variables
    return next(); // Continue to the next middleware or route handler
  }

  // If no reservation was found, respond with a 404 Not Found error
  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} cannot be found.`,
  });
}

/// This function is responsible for fetching and displaying a specific reservation's details by its ID.
async function read(req, res) {
  // Extract the reservation from the response's local variables (set previously by another middleware)
  const { reservation: data } = res.locals;

  // Send the fetched reservation details in the response
  res.json({ data });
}

// Array containing valid properties/fields for a reservation
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];

// Middleware function that validates the reservation properties in the request body.
function hasValidProperties(req, res, next) {
  // Extract 'data' from the request body, and default to an empty object if not provided
  const { data = {} } = req.body;

  // Determine any invalid fields by filtering out the keys from 'data' that are not in the VALID_PROPERTIES list
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  // If there are any invalid fields, respond with a 400 Bad Request error
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  // Validate that the 'people' property is a positive number. If not, respond with a 400 Bad Request error
  if (typeof data.people !== "number" || data.people <= 0) {
    return next({
      status: 400,
      message: "'people' field must be a number greater than 0",
    });
  }

  // If all checks pass, proceed to the next middleware or route handler
  next();
}

// Array containing all valid properties/fields for a reservation
const VALID_PROPERTIES_TWO = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

// Middleware function that validates the reservation properties in the request body.
function hasValidPropertiesTwo(req, res, next) {
  // Extract 'data' from the request body, and default to an empty object if not provided
  const { data = {} } = req.body;

  // Determine any invalid fields by filtering out the keys from 'data' that are not in the VALID_PROPERTIES_TWO list
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES_TWO.includes(field)
  );

  // If there are any invalid fields, respond with a 400 Bad Request error
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  // Validate that the 'people' property is a positive number. If not, respond with a 400 Bad Request error
  if (typeof data.people !== "number" || data.people <= 0) {
    return next({
      status: 400,
      message: "'people' field must be a number greater than 0",
    });
  }

  // If all checks pass, proceed to the next middleware or route handler
  next();
}

// Middleware function to validate the date and time format in the request body
function validateDateTime(req, res, next) {
  const { data = {} } = req.body;

  // Regular expression to validate date in YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Regular expression to validate time in HH:mm format (24-hour format)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  // If the date does not match the expected format, respond with a 400 Bad Request error
  if (!dateRegex.test(data.reservation_date)) {
    return next({
      status: 400,
      message:
        "'reservation_date' field must be a valid date in YYYY-MM-DD format",
    });
  }

  // If the time does not match the expected format, respond with a 400 Bad Request error
  if (!timeRegex.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "'reservation_time' field must be a valid time in HH:mm format",
    });
  }

  // If all validations pass, proceed to the next middleware or route handler
  next();
}

// Middleware function to validate the 'status' property in the request body.
// Ensures that the status is not set to "seated" or "finished" when creating or updating a reservation.
function validateStatus(req, res, next) {
  // Extract 'data' from the request body, defaulting to an empty object if not provided.
  const { data = {} } = req.body;

  // Check if the status is set to "seated" or "finished".
  if (data.status === "seated" || data.status === "finished") {
    // If so, respond with a 400 Bad Request error.
    return next({
      status: 400,
      message: "'status' cannot be seated or finished",
    });
  }

  // If the status is valid, proceed to the next middleware or route handler.
  next();
}

// Middleware function to validate the 'status' property in the request body.
// Ensures that the status is one of the allowed values.
function rejectForeingStatus(req, res, next) {
  // Extract 'data' from the request body.
  const { data = {} } = req.body;

  // List of valid status values.
  const validStatus = ["booked", "seated", "finished", "cancelled"];

  // Check if the status is not one of the valid values.
  if (!validStatus.includes(data.status)) {
    // If not, respond with a 400 Bad Request error.
    return next({
      status: 400,
      message: "'status' unknown please set to an allowed status",
    });
  }

  // If the status is valid, proceed to the next middleware or route handler.
  next();
}

// Middleware function to check if the reservation's status is "finished".
// Prevents updating a reservation if its status is "finished".
function updateFinish(req, res, next) {
  // Extract the reservation data from the response locals.
  const data = res.locals.reservation;

  // Check if the reservation's status is "finished".
  if (data.status === "finished") {
    // If so, respond with a 400 Bad Request error.
    return next({
      status: 400,
      message: "cannot be updated when reservation is finished",
    });
  }

  // If the status is not "finished", proceed to the next middleware or route handler.
  next();
}

/**
 * Middleware function to validate the reservation date.
 * - Ensures the reservation date is provided.
 * - Ensures the restaurant is not reserved on a Tuesday (closed day).
 * - Ensures the reservation is made for a future date.
 */
function validateReservationDate(req, res, next) {
  // Extract the reservation_date from the request body.
  const { data: { reservation_date } = {} } = req.body;

  // Check if the reservation_date is provided.
  if (!reservation_date)
    return next({ status: 400, message: "Reservation date is required" });

  const reservationDate = new Date(reservation_date);
  const today = new Date();

  // Set the time of today to 00:00:00 to only compare the date, not time.
  today.setHours(0, 0, 0, 0);

  // Check if the reservation date is a Tuesday.
  if (reservationDate.getUTCDay() === 2) {
    return next({ status: 400, message: "Restaurant is closed" });
  }

  // Check if the reservation date is in the past.
  if (reservationDate < today) {
    return next({ status: 400, message: "Make the reservation in the future" });
  }

  // If the date is valid, proceed to the next middleware or route handler.
  next();
}

/**
 * Middleware function to validate the reservation time.
 * - Ensures the reservation time is provided.
 * - Ensures the time is within the operating hours of the restaurant.
 */
function validateReservationTime(req, res, next) {
  // Extract the reservation_date and reservation_time from the request body.
  const { data: { reservation_date, reservation_time } = {} } = req.body;

  // Check if the reservation_time is provided.
  if (!reservation_time)
    return next({ status: 400, message: "Reservation time is required" });

  // Construct a Date object with the provided date and time.
  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}`
  );

  // Extract the hour and minute from the reservation time.
  const reservationHour = reservationDateTime.getHours();
  const reservationMinute = reservationDateTime.getMinutes();

  // Convert the reservation time to minutes since midnight for easy comparison.
  const reservationTimeInMinutes = reservationHour * 60 + reservationMinute;

  // Define the opening and closing time in minutes since midnight.
  const openingTimeInMinutes = 10 * 60 + 30; // 10:30 AM
  const closingTimeInMinutes = 21 * 60 + 30; // 9:30 PM

  // Check if the reservation time is before the opening time.
  if (reservationTimeInMinutes < openingTimeInMinutes) {
    return next({
      status: 400,
      message: "Reservations cannot be made before 10:30 AM",
    });
  }

  // Check if the reservation time is after the closing time.
  if (reservationTimeInMinutes > closingTimeInMinutes) {
    return next({
      status: 400,
      message: "Reservations cannot be made after 9:30 PM",
    });
  }

  // If the time is valid, proceed to the next middleware or route handler.
  next();
}

function validatePhoneNumber(req, res, next) {
  const { data = {} } = req.body;

  if (!data.mobile_number) {
    return next({
      status: 400,
      message: "Phone number is required",
    });
  }

  if (/[a-zA-Z]/.test(data.mobile_number)) {
    return next({
      status: 400,
      message: "Phone number should not contain any letters",
    });
  }

  next();
}

// Controller functions to manage reservations.

/**
 * Creates a new reservation.
 * - Uses the reservation service to store the new reservation data.
 * - Returns a 201 status code along with the created reservation data.
 */
async function create(req, res, next) {
  // Use the create method from the service to store the reservation.
  const data = await service.create(req.body.data);

  // Return a 201 Created status and the new reservation data.
  res.status(201).json({ data });
}

/**
 * Updates an existing reservation's status.
 * - Uses the reservation service to update the status of the reservation.
 * - Returns a 200 status code along with the updated reservation data.
 */
async function update(req, res, next) {
  // Construct the reservation object with the reservation_id and new status.
  const reservation = {
    reservation_id: res.locals.reservation.reservation_id,
    status: req.body.data.status,
  };

  // Use the update method from the service to update the reservation's status.
  await service.update(reservation);

  // Return a 200 OK status and the updated reservation data.
  res.status(200).json({ data: reservation });
}

/**
 * Updates an existing reservation.
 * - Constructs the updated reservation object from the request body and parameters.
 * - Uses the reservation service to update the reservation data.
 * - Returns the updated reservation data.
 */
async function updateRes(req, res) {
  // Extract the reservationId from the request parameters.
  const { reservationId } = req.params;

  // Construct the updated reservation object.
  const updatedReservation = {
    ...req.body.data,
    reservation_id: reservationId,
  };

  // Use the updateRes method from the service to update the reservation.
  const data = await service.updateRes(updatedReservation);

  // Return the updated reservation data.
  res.json({ data });
}

/**
 * Deletes a reservation.
 * - Uses the reservation service to delete the reservation based on its ID.
 * - Returns a 204 No Content status code indicating the reservation has been deleted.
 */
async function destroy(req, res, next) {
  // Extract the reservation object from the response's locals.
  const { reservation } = res.locals;

  // Use the delete method from the service to delete the reservation.
  await service.delete(reservation.reservation_id);

  // Return a 204 No Content status indicating successful deletion.
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    validateDateTime,
    validateStatus,
    validateReservationDate,
    validateReservationTime,
    validatePhoneNumber,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    rejectForeingStatus,
    updateFinish,
    asyncErrorBoundary(update),
  ],
  updateRes: [
    asyncErrorBoundary(reservationExists),
    hasValidPropertiesTwo,
    hasRequiredProperties,
    validateDateTime,
    validateReservationDate,
    validateReservationTime,
    validatePhoneNumber,
    asyncErrorBoundary(updateRes),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
