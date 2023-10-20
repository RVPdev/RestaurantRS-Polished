import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

// Function component for creating new tables
function NewTables() {
  // Initialize useHistory for route navigation
  const history = useHistory();

  // Initial form state for table creation
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  // Initialize state for form data
  const [formData, setFormData] = useState({ ...initialFormState });

  // Initialize state for holding any table errors
  const [tablesError, setTablesError] = useState(null);

  // Function to handle form input changes
  const handleChange = (event) => {
    // Update form data state based on input changes
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Format the form data before sending it
    const reservationFormatted = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    // API call to create a new table
    await createTable(reservationFormatted)
      // Navigate to the dashboard if successful
      .then(() => history.push(`/dashboard`))
      // Set the error state if there's an API error
      .catch(setTablesError);
  };

  // Render the form
  return (
    <div>
      <form className="row g-3 mt-2" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="table_name" className="form-label">
            Table Name:
          </label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            onChange={handleChange}
            value={formData.table_name}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="capacity" className="form-label">
            Capacity:
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            onChange={handleChange}
            value={formData.capacity}
            required
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-secondary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
      <ErrorAlert error={tablesError} />
    </div>
  );
}

export default NewTables;
