// Import required modules
const knex = require("../db/connection");

// Function to retrieve all reservations from the database
function list() {
  return knex("reservations").select("*");
}

// Function to retrieve a specific reservation by its ID from the database
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

// Function to retrieve reservations for a specific date from the database
function readDate(reservationDate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time", "asc");
}

// Function to create a new reservation in the database
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

// Function to update the status of an existing reservation in the database
function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update({ status: reservation.status });
}

// Function to update an existing reservation in the database
function updateRes(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((response) => response[0]);
}

// Function to delete a specific reservation from the database
function destroy(reservationId) {
  return knex("reservations").where({ reservationId }).del();
}

// Function to search for a reservation by mobile number in the database
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

// Export all the functions to be used elsewhere in the application
module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
  readDate,
  search,
  updateRes,
};
