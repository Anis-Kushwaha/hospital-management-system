import React from "react";

function AppointmentsSection({appointments,isOnline,getStatusClass,}){
  return(
    <>
                  <section className="appointments-section">
                <div className="section-header">
                  <h2>Today's Appointments</h2>
                  <a href="#" className="view-all">View All</a>
                </div>
                <div className="table-wrapper">
                  <table className="appointment-table">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Age</th>
                        <th>Department</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id}>
                          <td className="patient-name-cell">{appt.name}</td>
                          <td>{appt.age}</td>
                          <td>{appt.department}</td>
                          <td>{appt.time}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(appt.status)}`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="action-buttons">
                            <button className="btn-small btn-view">View Details</button>
                            <button className="btn-small btn-consult" disabled={!isOnline}>Start Consultation</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
    </>
  );
}
export default AppointmentsSection ;