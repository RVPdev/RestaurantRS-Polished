// The 'up' function describes the changes to apply to the database
exports.up = function (knex) {
  // Create a new table named 'tables'
  return knex.schema.createTable("tables", (table) => {
    // Create an auto-incrementing 'table_id' column to serve as the primary key
    table.increments("table_id").primary();

    // Create 'table_name' column for the name of the table.
    // This field is mandatory (notNullable) and is of string type.
    table.string("table_name").notNullable();

    // Create 'capacity' column to specify the number of people the table can accommodate.
    // It's an integer and is mandatory (notNullable).
    // The 'unsigned' ensures the values are non-negative.
    table.integer("capacity").notNullable().unsigned();

    // Create 'reservation_id' column to link this table to a particular reservation.
    // This acts as a foreign key referencing 'reservation_id' in the 'reservations' table.
    table.integer("reservation_id").unsigned();
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations");

    // Create timestamp fields 'created_at' and 'updated_at' for record keeping
    table.timestamps(true, true);
  });
};

// The 'down' function describes how to undo the changes from the 'up' function
exports.down = function (knex) {
  // Remove (drop) the 'tables' table from the database
  return knex.schema.dropTable("tables");
};
