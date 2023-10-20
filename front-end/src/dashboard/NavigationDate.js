// Import necessary packages and modules
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { previous, next } from "../utils/date-time";

// NavigationDate component to navigate between different dates on the dashboard
function NavigationDate({ date }) {
  // React Router's useHistory hook to manipulate the history object
  const history = useHistory();

  // Uncomment below to log the date for debugging
  // console.log(date);

  return (
    <div className="row row-cols-auto ms-2 mb-3">
      {/* Button to navigate to the previous date */}
      <button
        className="col btn btn-secondary"
        type="button"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Prev
      </button>

      {/* Button to navigate to today's date */}
      <button
        className="col ms-3 btn btn-secondary"
        type="button"
        onClick={() => history.push(`/dashboard`)}
      >
        Today
      </button>

      {/* Button to navigate to the next date */}
      <button
        className="col ms-3 btn btn-secondary"
        type="button"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
    </div>
  );
}

// Export the NavigationDate component
export default NavigationDate;
