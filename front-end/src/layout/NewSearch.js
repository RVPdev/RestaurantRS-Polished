import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import ReservationsList from "../dashboard/ReservationsList";

// Function component for handling reservation search
function NewSearch() {
  // Initialize the form state with a mobile_number field
  const initialFormState = {
    mobile_number: "",
  };

  // Initialize state for the mobile number and set it to initial form state
  const [mobile, setMobile] = useState({ ...initialFormState });

  // Initialize state for holding reservations
  const [reservations, setReservations] = useState([]);

  // Initialize state for holding any reservation errors
  const [reservationsError, setReservationsError] = useState(null);

  // Use useEffect to load reservations whenever the mobile state changes
  useEffect(loadReservation, [mobile]);

  // Function to load reservations based on the mobile number
  function loadReservation() {
    // Initialize abort controller for aborting fetch requests
    const abortController = new AbortController();

    // Reset any previous errors
    setReservationsError(null);

    // API call to fetch reservations based on the mobile number
    listReservations(mobile, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    // Cleanup: abort the fetch request when the component is unmounted
    return () => abortController.abort();
  }

  // Handle form input changes
  const handleChange = (event) => {
    setMobile({ ...mobile, [event.target.name]: event.target.value });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    // Prevent default behavior of form submission
    event.preventDefault();

    // Call the loadReservation function to update the reservations list
    loadReservation();
  };

  // Component rendering
  return (
    <div>
      <form className="row g-3 mt-2" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            type="tel"
            className="form-control"
            onChange={handleChange}
            value={mobile.mobile_number}
          ></input>
        </div>

        <div className="col-md-6">
          <button type="submit" className="btn btn-primary">
            Find
          </button>
        </div>
      </form>
      <div className="row g-3 mt-2">
        {reservations.map((reservation, index) => (
          <ReservationsList reservation={reservation} key={index} />
        ))}
      </div>
      {reservations.length === 0 && <h2>No reservations found</h2>}
      <ErrorAlert error={reservationsError} />
    </div>
  );
}

export default NewSearch;

