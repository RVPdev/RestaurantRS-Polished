// Import required packages and components
import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import NavigationDate from "./NavigationDate";
import ReservationsList from "./ReservationsList";
import TablesList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  // Initialize state variables for reservations and errors
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  // Initialize state variables for tables and errors
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  // State variable to trigger re-render
  const [trigger, setTrigger] = useState(0);

  // UseEffect to load the dashboard data whenever the date or trigger changes
  useEffect(loadDashboard, [date, trigger]);

  // Function to fetch reservations and tables data
  function loadDashboard() {
    // Initialize AbortController for clean up
    const abortController = new AbortController();

    // Reset errors
    setReservationsError(null);
    setTablesError(null);

    // Fetch reservations
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    // Fetch tables
    listTables(abortController.signal).then(setTables).catch(setTablesError);

    // Cleanup function
    return () => abortController.abort();
  }

  // JSX for Dashboard
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <div>
        {/* Component to navigate dates */}
        <NavigationDate date={date} />
      </div>
      {/* Error alerts for reservations */}
      <ErrorAlert error={reservationsError} />

      <div className="row g-3 mt-2">
        {/* List of reservations */}
        {reservations.map((reservation, index) => (
          <ReservationsList reservation={reservation} key={index} />
        ))}
      </div>

      <div className="row g-3 mt-2">
        {/* List of tables */}
        {tables.map((table, index) => (
          <TablesList table={table} key={index} setTrigger={setTrigger} />
        ))}
      </div>
      {/* Error alerts for tables */}
      <ErrorAlert error={tablesError} />
    </main>
  );
}

// Export the Dashboard component
export default Dashboard;
