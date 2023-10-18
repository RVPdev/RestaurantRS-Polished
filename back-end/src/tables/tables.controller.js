// Importing required modules and functions
const service = require("./tables.service"); // Importing service functions for tables
const reservationService = require("../reservations/reservations.service"); // Importing service functions for reservations
const asyncErrorBoundary = require("../errors/asyncErrorBoundary"); // Importing error handling middleware

// Importing a helper function to check if specific properties exist in request data
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity"); // Setting the required properties for a table

// Controller function to list all tables
// This function fetches all tables from the database and sends it back as JSON
async function list(req, res, next) {
  const data = await service.list(); // Fetching all tables
  res.json({ data: data }); // Sending the fetched data back as JSON
}

// Middleware to check if a table exists by its ID
// This middleware checks whether a table with a given ID exists in the database
async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId); // Fetching the table by its ID

  // If table exists, it will be stored in res.locals for future middleware or controller to use
  if (table) {
    res.locals.table = table;
    return next();
  }

  // If table does not exist, an error is passed to the next middleware
  next({
    status: 404,
    message: `Table ${req.params.tableId} cannot be found.`,
  });
}

// Middleware to check if a reservation exists by its ID
// This middleware verifies the existence of a reservation by its ID in the database.
async function reservationExists(req, res, next) {
  // Fetch the reservation details using the reservation ID from the request body
  const reservation = await reservationService.read(
    req.body.data.reservation_id
  );

  // If the reservation exists, store it in res.locals for future middleware or controller to use
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  // If the reservation does not exist, return an error with status 404
  next({
    status: 404,
    message: `Reservation ${req.body.data.reservation_id} cannot be found.`,
  });
}

// Controller function to read a specific table by its ID
// This function fetches a table's details based on its ID and sends it back as JSON.
async function read(req, res, next) {
  // Extracting the table data stored in res.locals by the previous middleware
  const { table: data } = res.locals;

  // Sending the fetched table data back as JSON
  res.json({ data });
}

// Define a list of valid properties that a table can have
const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

// Middleware function to check if the request body contains only valid properties
// It filters out any property that is not in the VALID_PROPERTIES list
function hasValidProperties(req, res, next) {
  // Destructuring data object from request body
  const { data = {} } = req.body;

  // Filtering out invalid properties by checking against VALID_PROPERTIES
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  // If any invalid fields are found, return a 400 status with a list of the invalid fields
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  // Proceed to the next middleware or route handler
  next();
}

// Middleware function to validate the properties of a table, like its name length and capacity
// This middleware ensures the 'table_name' is at least 2 characters and 'capacity' is a number
function validateTableProps(req, res, next) {
  // Destructuring data object from request body
  const { data = {} } = req.body;

  // Validating 'table_name' length
  if (data.table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name must be at least 2 characters long",
    });
  }

  // Validating 'capacity' type
  if (typeof data.capacity !== "number") {
    return next({
      status: 400,
      message: "capacity must be a number larger than 0",
    });
  }

  // Proceed to the next middleware or route handler
  next();
}

// Controller function to create a new table
// This function takes the validated table data from the request body and saves it in the database
async function create(req, res, next) {
  // Creating a new table and storing the resulting data
  const data = await service.create(req.body.data);

  // Sending a 201 status code along with the newly created table data as JSON
  res.status(201).json({ data });
}

// Controller function to update an existing table
// This function validates and updates the table's reservation status and details
async function update(req, res, next) {
  // Create a reservation object containing the reservation_id and status 'seated'
  const reservation = {
    reservation_id: req.body.data.reservation_id,
    status: "seated",
  };

  // Check if the reservation exists and its status is 'booked'
  if (res.locals.reservation && res.locals.reservation.status === "booked") {
    // Update the reservation status to 'seated'
    await reservationService.update(reservation);
  }
  // Check if the reservation is already 'seated'
  else if (res.locals.reservation.status === "seated") {
    return next({
      status: 400,
      message: "reservation is already 'seated'",
    });
  }

  // Create a table object by merging the request body data and existing table ID
  const table = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  // Update the table in the database and store the resulting data
  const data = await service.update(table);

  // Send the updated table data as JSON response
  res.json({ data });
}

// Middleware function to validate the 'reservation_id' property in the request body
// This ensures that a 'reservation_id' is provided in the request for updating the table
function tableValidatorU(req, res, next) {
  // Destructuring 'data' object from request body
  const { data = {} } = req.body;

  // Check if 'reservation_id' is missing in the request body
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is missing",
    });
  }

  // Proceed to the next middleware or route handler
  next();
}

// Middleware to check if the table is already occupied by a reservation
// This function prevents a table from being double-booked
function isOccupied(req, res, next) {
  // Check if the table in question already has a reservation_id (i.e., is occupied)
  if (res.locals.table.reservation_id) {
    // Return an error if the table is already occupied
    return next({
      status: 400,
      message: "reservation_id is occupied",
    });
  }

  // Proceed to the next middleware or route handler if the table is not occupied
  next();
}

// Middleware to check if the table is not occupied
// This function ensures that a table must be occupied to proceed to the next step
function isNotOccupied(req, res, next) {
  // Check if the table in question does not have a reservation_id (i.e., is not occupied)
  if (!res.locals.table.reservation_id) {
    // Return an error if the table is not occupied
    return next({
      status: 400,
      message: "not occupied",
    });
  }

  // Proceed to the next middleware or route handler if the table is occupied
  next();
}

// Middleware to validate if the table's capacity is sufficient for the reservation
// This function prevents a reservation from being seated at a table that is too small
function valdiateCapacity(req, res, next) {
  // Check if the table's capacity is less than the number of people in the reservation
  if (res.locals.table.capacity < res.locals.reservation.people) {
    // Return an error if the table's capacity is insufficient
    return next({
      status: 400,
      message: "capacity error",
    });
  }

  // Proceed to the next middleware or route handler if the table's capacity is sufficient
  next();
}

// Delete an existing table
// This function also updates the status of the reservation to "finished"
async function destroy(req, res, next) {
  // Get the table from res.locals
  const { table } = res.locals;

  // If data is present in the request body, update the reservation status to "finished"
  if (req.body.data) {
    const reservation = {
      reservation_id: req.body.data.reservation_id,
      status: "finished",
    };
    await reservationService.update(reservation);
  }

  // Delete the table by its ID
  await service.delete(table.table_id);

  // Send a 200 OK response with an empty JSON object
  res.status(200).json({});
}

// Exporting the functions as middleware and controllers for routing
module.exports = {
  // List all tables
  list: asyncErrorBoundary(list),

  // Get a specific table by its ID
  read: [asyncErrorBoundary(tableExists), read],

  // Create a new table
  create: [
    hasValidProperties, // Check for valid properties in the request body
    hasRequiredProperties, // Check for required properties in the request body
    validateTableProps, // Validate specific table properties
    asyncErrorBoundary(create), // Execute the create function within an async error boundary
  ],

  // Update an existing table
  update: [
    tableValidatorU, // Validate the table based on custom rules
    asyncErrorBoundary(tableExists), // Check if the table exists
    asyncErrorBoundary(reservationExists), // Check if the reservation exists
    isOccupied, // Check if the table is already occupied
    valdiateCapacity, // Validate the table's capacity against the reservation
    asyncErrorBoundary(update), // Execute the update function within an async error boundary
  ],

  // Delete an existing table
  delete: [
    asyncErrorBoundary(tableExists), // Check if the table exists
    isNotOccupied, // Check if the table is not occupied
    asyncErrorBoundary(destroy), // Execute the destroy function within an async error boundary
  ],
};
