// Importing the database connection
const knex = require("../db/connection");

// Retrieves all table records from the database, sorted by table_name
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// Retrieves a specific table record based on its ID
function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

// Inserts a new table record into the database
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createTable) => createTable[0]);
}

// Updates an existing table record based on its ID
function update(table) {
  return knex("tables")
    .select("*")
    .where({ table_id: table.table_id })
    .update(table, "*");
}

// Removes the reservation_id from a specific table based on its ID
function destroy(tableId) {
  return knex("tables").where({ table_id: tableId }).update({
    reservation_id: null,
  });
}

// Exporting the functions for use in other files
module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
};
