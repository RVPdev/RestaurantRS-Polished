# Restaurant Reservation System

## Overview

This repository contains the backend code for a Restaurant Reservation System, built using Node.js and Express. The system includes RESTful APIs for managing reservations and tables, as well as other functionalities like seating and cancelling reservations.

## Features

- CRUD operations for reservations and tables
- Advanced validations for reservation time, date, and table capacity
- Middleware for error handling and property validations

## Getting Started

### Prerequisites

- Node.js
- Express.js
- knex.js (for database interactions)

### Installation

1. Clone this repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npm start` to start the server

## Project Structure

- `/errors`: Contains middleware for handling errors and 405 Method Not Allowed responses.
- `/reservations`: Contains the controller and service for handling reservation-related operations.
- `/tables`: Contains the controller and service for handling table-related operations.
- `app.js`: The main Express application file.

## API Endpoints

### Reservations

- `GET /reservations`: List all reservations
- `GET /reservations/:reservationId`: Get a reservation by its ID
- `POST /reservations`: Create a new reservation
- `PUT /reservations/:reservationId/status`: Update the status of a reservation

### Tables

- `GET /tables`: List all tables
- `GET /tables/:tableId`: Get a table by its ID
- `POST /tables`: Create a new table
- `PUT /tables/:tableId/seat`: Seat a reservation at a table
- `DELETE /tables/:tableId/seat`: Clear the table

## Middleware

- `asyncErrorBoundary`: Handles async errors
- `hasProperties`: Checks if the necessary properties exist in the request body
- `methodNotAllowed`: Handles 405 Method Not Allowed responses

## Validations

- `validateReservationDate`: Validates the reservation date
- `validateReservationTime`: Validates the reservation time
- `validateTableProps`: Validates properties of a table

## Error Handling

- `errorHandler`: Global error handler
- `notFound`: 404 Not Found handler

## Contributing

If you want to contribute to this project, feel free to fork the repository,