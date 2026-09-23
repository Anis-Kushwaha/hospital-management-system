import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openStatusMenu, setOpenStatusMenu] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/appointments/admin",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE APPOINTMENT STATUS
  // =========================

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      const response = await fetch(
        `http://localhost:8080/api/appointments/admin/${id}/status?status=${newStatus}`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      const updatedAppointment = await response.json();

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment.id === id ? updatedAppointment : appointment,
        ),
      );

      setOpenStatusMenu(null);
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Unable to update appointment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // OPEN / CLOSE STATUS MENU
  // =========================

  const toggleStatusMenu = (event, appointmentId) => {
    if (openStatusMenu === appointmentId) {
      setOpenStatusMenu(null);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.right,
    });

    setOpenStatusMenu(appointmentId);
  };

  // =========================
  // STATUS CSS CLASS
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "WAITING":
        return "status waiting";

      case "DOCTOR_ASSIGNED":
        return "status doctor-assigned";

      case "COMPLETED":
        return "status completed";

      case "CANCELLED":
        return "status cancelled";

      case "RESCHEDULED":
        return "status rescheduled";

      default:
        return "status";
    }
  };

  // =========================
  // STATUS LABEL
  // =========================

  const getStatusLabel = (status) => {
    switch (status) {
      case "WAITING":
        return "Waiting";

      case "DOCTOR_ASSIGNED":
        return "Doctor Assigned";

      case "COMPLETED":
        return "Completed";

      case "CANCELLED":
        return "Cancelled";

      case "RESCHEDULED":
        return "Rescheduled";

      default:
        return status;
    }
  };

  // =========================
  // STATUS ACTION UI
  // =========================

  const renderStatusActions = (appointment) => {
    const isOpen = openStatusMenu === appointment.id;
    const isUpdating = updatingId === appointment.id;

    return (
      <div className="status-action-wrapper">
        <span className={getStatusClass(appointment.status)}>
          {getStatusLabel(appointment.status)}
        </span>

        <button
          className="status-change-btn"
          disabled={isUpdating}
          onClick={(event) => toggleStatusMenu(event, appointment.id)}
        >
          {isUpdating ? "Updating..." : "Change"}
        </button>

        {isOpen &&
          !isUpdating &&
          createPortal(
            <div
              className="status-menu"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              {appointment.status !== "WAITING" && (
                <button
                  className="status-option waiting-option"
                  onClick={() => updateStatus(appointment.id, "WAITING")}
                >
                  <span>🕒</span>
                  Waiting
                </button>
              )}

              {appointment.status !== "DOCTOR_ASSIGNED" && (
                <button
                  className="status-option assigned-option"
                  onClick={() =>
                    updateStatus(appointment.id, "DOCTOR_ASSIGNED")
                  }
                >
                  <span>👨‍⚕️</span>
                  Assigned
                </button>
              )}

              {appointment.status !== "RESCHEDULED" && (
                <button
                  className="status-option reschedule-option"
                  onClick={() => updateStatus(appointment.id, "RESCHEDULED")}
                >
                  <span>📅</span>
                  Reschedule
                </button>
              )}

              {appointment.status !== "COMPLETED" && (
                <button
                  className="status-option complete-option"
                  onClick={() => updateStatus(appointment.id, "COMPLETED")}
                >
                  <span>✓</span>
                  Complete
                </button>
              )}

              {appointment.status !== "CANCELLED" && (
                <button
                  className="status-option cancel-option"
                  onClick={() => updateStatus(appointment.id, "CANCELLED")}
                >
                  <span>✕</span>
                  Cancel
                </button>
              )}
            </div>,
            document.body,
          )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-appointments">
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="admin-appointments">
      <div className="appointments-header">
        <div>
          <h2>Appointments</h2>
          <p>Monitor and manage all hospital appointments</p>
        </div>

        <button className="refresh-btn" onClick={fetchAppointments}>
          Refresh
        </button>
      </div>

      <div className="appointments-card">
        <div className="table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Token</th>
                <th>Patient</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Assigned Doctor</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>

                    <td>
                      <span className="token">{appointment.token}</span>
                    </td>

                    <td>{appointment.name}</td>

                    <td>{appointment.department}</td>

                    <td>{appointment.date}</td>

                    <td>{appointment.slot}</td>

                    <td>{renderStatusActions(appointment)}</td>

                    <td>
                      {appointment.doctor ? appointment.doctor.name : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
