// The 'up' function describes the changes to apply to the database
exports.up = function (knex) {
  // Create a new table named 'reservations'
  return knex.schema.createTable("reservations", (table) => {
    // Create an auto-incrementing 'reservation_id' column to serve as the primary key
    table.increments("reservation_id").primary();

    // Create other necessary fields for the reservation
    table.string("first_name").notNullable(); // First name of the person making the reservation
    table.string("last_name").notNullable(); // Last name of the person making the reservation
    table.string("mobile_number").notNullable(); // Mobile number of the person making the reservation
    table.date("reservation_date").notNullable(); // Date of the reservation
    table.time("reservation_time").notNullable(); // Time of the reservation
    table.integer("people").unsigned().notNullable(); // Number of people for the reservation, unsigned means non-negative
    table.string("status").defaultTo("booked"); // Reservation status with a default value of "booked"

    // Create timestamp fields 'created_at' and 'updated_at' for record keeping
    table.timestamps(true, true);
  });
};

// The 'down' function describes how to undo the changes from the 'up' function
exports.down = function (knex) {
  // Remove (drop) the 'reservations' table from the database
  return knex.schema.dropTable("reservations");
};
