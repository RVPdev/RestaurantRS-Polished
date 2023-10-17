// Import the table data from a JSON file
const data = require("./01-tables.json");

// Define the seed function to populate the database
exports.seed = function (knex) {
  // First, run a raw SQL command to truncate (clear) the 'tables' table,
  // restart its primary key sequence, and cascade the changes to related tables.
  return (
    knex
      .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")

      // Once the table is cleared, then insert the table data from the JSON file.
      .then(function () {
        return knex("tables").insert(data);
      })
  );
};
