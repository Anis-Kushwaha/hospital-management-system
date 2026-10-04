import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assigningDoctorId, setAssigningDoctorId] = useState(null);
  const [openStatusMenu, setOpenStatusMenu] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // =========================
  // FETCH DOCTORS
  // =========================

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/doctors");

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // =========================
  // FETCH APPOINTMENTS
  // =========================

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
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update appointment status");
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
      alert(error.message || "Unable to update appointment status.");
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
    const isCompleted = appointment.status === "COMPLETED";

    return (
      <div className="status-action-wrapper">
        <span className={getStatusClass(appointment.status)}>
          {getStatusLabel(appointment.status)}
        </span>

        <button
          className="status-change-btn"
          disabled={isUpdating || isCompleted}
          onClick={(event) => toggleStatusMenu(event, appointment.id)}
        >
          {isCompleted
            ? "Cannot Chnage"
            : isUpdating
              ? "Updating..."
              : "Change"}
        </button>

        {isOpen &&
          !isUpdating &&
          !isCompleted &&
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

  // =========================
  // ASSIGN / REMOVE DOCTOR
  // =========================

  const handleDoctorChange = (appointment, value) => {
    if (value === "REMOVE") {
      removeDoctor(appointment.id);
      return;
    }

    if (value) {
      assignDoctor(appointment.id, value);
    }
  };

  const assignDoctor = async (appointmentId, doctorId) => {
    try {
      setAssigningDoctorId(appointmentId);

      const response = await fetch(
        `http://localhost:8080/api/appointments/admin/${appointmentId}/assign-doctor/${doctorId}`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to assign doctor");
      }

      const updatedAppointment = await response.json();

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment.id === appointmentId ? updatedAppointment : appointment,
        ),
      );
    } catch (error) {
      console.error("Doctor assignment failed:", error);
      alert(error.message || "Unable to assign doctor.");
    } finally {
      setAssigningDoctorId(null);
    }
  };

  const removeDoctor = async (appointmentId) => {
    try {
      setAssigningDoctorId(appointmentId);

      const response = await fetch(
        `http://localhost:8080/api/appointments/admin/${appointmentId}/remove-doctor`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to remove doctor");
      }

      const updatedAppointment = await response.json();

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment.id === appointmentId ? updatedAppointment : appointment,
        ),
      );
    } catch (error) {
      console.error("Remove doctor failed:", error);
      alert(error.message || "Unable to remove doctor.");
    } finally {
      setAssigningDoctorId(null);
    }
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

        <button
          className="refresh-btn"
          onClick={() => {
            fetchAppointments();
            fetchDoctors();
          }}
        >
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
                appointments.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className="appointment-row"
                    style={{
                      animationDelay: `${index * 0.15}s`,
                    }}
                  >
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
                      {appointment.status === "COMPLETED" ? (
                        <div className="completed-doctor">
                          {appointment.doctor?.name || "N/A"}
                        </div>
                      ) : (
                        <select
                          className="doctor-select"
                          value={appointment.doctor?.id || ""}
                          disabled={assigningDoctorId === appointment.id}
                          onChange={(e) =>
                            handleDoctorChange(appointment, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            {assigningDoctorId === appointment.id
                              ? "Updating..."
                              : "Select Doctor"}
                          </option>

                          {doctors
                            .filter(
                              (doctor) =>
                                doctor.active &&
                                doctor.department === appointment.department,
                            )
                            .map((doctor) => (
                              <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                              </option>
                            ))}

                          {appointment.doctor && (
                            <option value="REMOVE">Remove Doctor</option>
                          )}
                        </select>
                      )}
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
