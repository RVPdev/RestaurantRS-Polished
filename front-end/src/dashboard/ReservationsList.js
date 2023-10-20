// Import necessary modules and packages
import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { changeStatusCancelled } from "../utils/api";

// ReservationsList Component to display a list of reservations
function ReservationsList({ reservation }) {
  
  // Function to format 24-hour time to 12-hour time with AM/PM
  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const isPM = hour >= 12;
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute} ${isPM ? "PM" : "AM"}`;
  };

  // Handle click event to cancel a reservation
  const handleClick = async (event) => {
    const windowConfirm = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (windowConfirm) {
      await changeStatusCancelled(reservation.reservation_id).catch();
      window.location.reload();
    }
  };

  return (
    <div className="col-md-3 text-center ">
      {/* Show Seat button only if reservation is booked */}
      {reservation.status === "booked" && (
        <Link
          className="btn btn-primary col"
          to={`/reservations/${reservation.reservation_id}/seat`}
        >
          Seat
        </Link>
      )}

      {/* Display reservation details */}
      <h4>
        {reservation.first_name} {reservation.last_name}
      </h4>
      <p>time: {formatTime(reservation.reservation_time)}</p>
      <p>Mobile: {reservation.mobile_number}</p>
      <p>People: {reservation.people}</p>
      <p data-reservation-id-status={`${reservation.reservation_id}`}>
        Status: {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
      </p>

      {/* Show Edit and Cancel buttons only if reservation is booked */}
      {reservation.status === "booked" && (
        <div className="row container">
          <Link
            className="btn btn-success col"
            to={`/reservations/${reservation.reservation_id}/edit`}
          >
            Edit
          </Link>
          <button
            className="btn btn-danger col ms-1"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleClick}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// Export the component
export default ReservationsList;
