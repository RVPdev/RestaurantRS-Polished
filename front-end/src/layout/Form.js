// Import required modules
import React from "react";
import ErrorAlert from "./ErrorAlert";

// Form component definition
function Form({ handleSubmit, handleChange, formData, reservationsError, history }) {
  return (
    <div>
      {/* Form layout with row and column structure */}
      <form onSubmit={handleSubmit} className="row g-3 mt-2">

        {/* First Name input field */}
        <div className="col-md-6">
          <label htmlFor="first_name" className="form-label">
            First Name:
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            onChange={handleChange} // Event handler for value change
            value={formData.first_name}
            required
            className="form-control"
          />
        </div>

        {/* Last Name input field */}
        <div className="col-md-6">
          <label htmlFor="last_name" className="form-label">
            Last Name:
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            onChange={handleChange}
            value={formData.last_name}
            required
            className="form-control"
          />
        </div>

        {/* Mobile Number input field */}
        <div className="col-md-6">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number
          </label>
          <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            onChange={handleChange}
            value={formData.mobile_number}
            required
            className="form-control"
          />
        </div>

        {/* Number of People input field */}
        <div className="col-md-6">
          <label htmlFor="people" className="form-label">
            Number of People
          </label>
          <input
            id="people"
            name="people"
            type="number"
            min={1}
            onChange={handleChange}
            value={formData.people}
            required
            className="form-control"
          />
        </div>

        {/* Date of Reservation input field */}
        <div className="col-md-6">
          <label htmlFor="reservation_date" className="form-label">
            Date of Reservation
          </label>
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            onChange={handleChange}
            value={formData.reservation_date}
            required
            className="form-control"
          />
        </div>

        {/* Time of Reservation input field */}
        <div className="col-md-6">
          <label htmlFor="reservation_time" className="form-label">
            Time of Reservation
          </label>
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
            className="form-control"
          />
        </div>

        {/* Submit and Cancel buttons */}
        <button type="submit" className="btn btn-secondary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => history.goBack()} // Navigate to the previous page
        >
          Cancel
        </button>
      </form>

      {/* Display any reservation errors */}
      <ErrorAlert error={reservationsError} />
    </div>
  );
}

// Export the Form component
export default Form;

