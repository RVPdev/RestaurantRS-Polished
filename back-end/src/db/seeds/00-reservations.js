// Import the reservation data from a JSON file
const data = require("./00-reservations.json");

// Define the seed function to populate the database
exports.seed = function (knex) {
  // First, run a raw SQL command to truncate (clear) the 'reservations' table,
  // restart its primary key sequence, and cascade the changes to related tables.
  return (
    knex
      .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")

      // Once the table is cleared, then insert the reservation data from the JSON file.
      .then(function () {
        return knex("reservations").insert(data);
      })
  );
};
