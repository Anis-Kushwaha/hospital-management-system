import { useState } from "react";

function AssignedAppointments({
  appointments,
  loading,
  onStatusChange,
  onOpenPatient,
}) {
  const [selectedDate, setSelectedDate] = useState("");

  const filteredAppointments = selectedDate
    ? appointments.filter((appointment) => appointment.date === selectedDate)
    : appointments;

  return (
    <section className="queue-section">
      <div className="section-header">
        <div>
          <h2>Assigned Appointments</h2>
          <p className="section-header__sub">
            Appointments currently assigned to you
          </p>
        </div>

        <div className="appointment-date-filter">
          <label htmlFor="appointment-date">Select Date</label>

          <input
            id="appointment-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {selectedDate && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setSelectedDate("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="queue-table-wrap">
        <table className="queue-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Patient</th>
              <th>Department</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="queue-empty">
                  Loading appointments...
                </td>
              </tr>
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="queue-empty">
                  {selectedDate
                    ? "No appointments assigned for this date."
                    : "No appointments assigned to you."}
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => {
                const status = String(appointment.status || "")
                  .trim()
                  .toUpperCase();

                return (
                  <tr key={appointment.id}>
                    <td>
                      <span className="token-chip">{appointment.token}</span>
                    </td>

                    <td>{appointment.name}</td>
                    <td>{appointment.department}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.slot}</td>

                    <td>
                      <span className="assigned-status">
                        {status.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td>
                      {status === "DOCTOR_ASSIGNED" && (
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={() => onOpenPatient(appointment.token, true)}
                        >
                          Start Consultation
                        </button>
                      )}

                      {status === "IN_CONSULTATION" && (
                        <button
                          className="btn btn--outline btn--sm"
                          onClick={() =>
                            onOpenPatient(appointment.token, false)
                          }
                        >
                          Open Consultation
                        </button>
                      )}

                      {status === "COMPLETED" && (
                        <button
                          className="btn btn--outline btn--sm"
                          onClick={() =>
                            onOpenPatient(appointment.token, false)
                          }
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AssignedAppointments;
