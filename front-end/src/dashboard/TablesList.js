// Import required modules
import React, { useState } from "react";
import { finishSeat } from "../utils/api";

// Component to display a list of tables
function TablesList({ table, setTrigger }) {
  
  // State to hold any seat errors
  const [seatError, setSeatError] = useState(null);

  // Handle click event to finish seating at a table
  const handleClick = async (event) => {
    setSeatError(null);  // Clear any existing errors
    const windowConfirm = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (windowConfirm === true) {
      try {
        // Call API to finish seating
        await finishSeat(table.table_id, table.reservation_id);
      } catch (error) {
        // Handle any errors during the API call
        setSeatError(error);
      }
      // Trigger a re-render to reflect changes
      setTrigger((prev) => prev + 1);
    }
    console.log(seatError); // Log any seat errors (optional)
  };

  return (
    <div className="col-md-3">
      {/* Display table name */}
      <h4>{table.table_name}</h4>

      {/* Display table status */}
      <p data-table-id-status={`${table.table_id}`}>
        {table.reservation_id ? "Occupied" : "Free"}
      </p>

      {/* Show Finish button only if table is occupied */}
      {table.reservation_id && (
        <button
          className="btn btn-danger button"
          data-table-id-finish={`${table.table_id}`}
          onClick={handleClick}
        >
          Finish
        </button>
      )}
    </div>
  );
}

// Export the TablesList component
export default TablesList;
