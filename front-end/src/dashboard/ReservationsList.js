import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { changeStatusCancelled } from "../utils/api";

function ReservationsList({ reservation }) {
  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");

    // Determine AM/PM
    const isPM = hour >= 12;
    const adjustedHour = hour % 12 || 12; // Adjust the hour. Note: 12 in 24-hour format should become 12 in 12-hour format.

    // Return the new format
    return `${adjustedHour}:${minute} ${isPM ? "PM" : "AM"}`;
  };

  const handleClick = async (event) => {
    const windowConfirm = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if(windowConfirm) {
      await changeStatusCancelled(reservation.reservation_id).catch()
      window.location.reload()
    }
  };

  return (
    <div className="col-md-3 text-center ">
      {reservation.status === "booked" && (
        <Link
          className="btn btn-primary col"
          to={`/reservations/${reservation.reservation_id}/seat`}
          href={`/reservations/${reservation.reservation_id}/seat`}
        >
          Seat
        </Link>
      )}
      <h4>
        {reservation.first_name} {reservation.last_name}
      </h4>
      <p>time: {formatTime(reservation.reservation_time)}</p>
      <p>Mobile: {reservation.mobile_number}</p>
      <p>People: {reservation.people}</p>
      <p data-reservation-id-status={`${reservation.reservation_id}`}>
        Status:{" "}
        {reservation.status.charAt(0).toUpperCase() +
          reservation.status.slice(1)}
      </p>

      {reservation.status === "booked" && (
        <div className="row container">
          <Link
            className="btn btn-success col"
            to={`/reservations/${reservation.reservation_id}/edit`}
            href={`/reservations/${reservation.reservation_id}/edit`}
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

export default ReservationsList;
