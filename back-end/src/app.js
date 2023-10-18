// Import required modules
const path = require("path");
// Load environment variables from .env file
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Import Express framework and additional modules
const express = require("express");
const cors = require("cors");

// Import custom error handling middleware
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

// Import route handlers (routers)
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");

// Initialize Express app
const app = express();

// Middleware for enabling CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Middleware for parsing JSON bodies
app.use(express.json());

// Register route handlers (routers)
// Attach reservations router to '/reservations' path
app.use("/reservations", reservationsRouter);
// Attach tables router to '/tables' path
app.use("/tables", tablesRouter);

// Register 404 Not Found middleware
// This middleware is invoked if no preceding route or middleware sends a response
app.use(notFound);

// Register global error handling middleware
// This middleware is invoked whenever an error is thrown or passed to next()
app.use(errorHandler);

// Export the configured app for use in other modules
module.exports = app;
