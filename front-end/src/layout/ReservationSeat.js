import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, readReservation, seatReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert"

// Function component for seating a reservation
function ReservationSeat() {
  // Initialize useHistory for route navigation and useParams to get reservation_id from URL
  const history = useHistory();
  const { reservation_id } = useParams();

  // Initialize state for reservation data and errors
  const [reservation, setReservation] = useState({});
  const [reservationError, setReservationError] = useState(null);

  // Initialize state for table errors and selected table ID
  const [tablesError, setTablesError] = useState(null);
  const [tableId, setTableId] = useState("");

  // Initialize state for submit errors and available tables
  const [submitError, setSubmitError] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  // Fetch available tables
  useEffect(() => {
    const abortController = new AbortController();
    setTablesError(null);

    listTables(abortController.signal)
      .then(setAvailableTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }, []);

  // Fetch reservation details
  useEffect(() => {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);

    return () => abortController.abort();
  }, [reservation_id]);

  // Handler for changing selected table
  function changeHandler({ target: { value } }) {
    setTableId(value);
  }

  // Handler for cancel button
  function onCancel() {
    history.goBack();
  }

  // Handler for form submission
  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setSubmitError(null);

    seatReservation(reservation.reservation_id, tableId)
      .then(() => history.push("/dashboard"))
      .catch(setSubmitError);
  }

  // Render form and other elements
  return (
    <main>
      <h1>Seat Reservation</h1>
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={reservationError} />
      <ErrorAlert error={submitError} />
      <h3>
        # {reservation_id} - {reservation.first_name} {reservation.last_name} on{" "}
        {reservation.reservation_date} at {reservation.reservation_time} for{" "}
        {reservation.people}{" "}
      </h3>
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="form-group col">
              <label htmlFor="table_id">Seat at:</label>
              <select
                id="table_id"
                name="table_id"
                className="form-control"
                value={tableId}
                required={true}
                onChange={changeHandler}
              >
                <option value="">Select a table</option>
                {availableTables.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2 cancel"
            onClick={onCancel}
          >
            <span className="oi oi-x" /> Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="oi oi-check" /> Submit
          </button>
        </fieldset>
      </form>
    </main>
  );
}

export default ReservationSeat;
