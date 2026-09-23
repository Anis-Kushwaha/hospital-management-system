import React, { useEffect, useState } from "react";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/doctors");

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();

      setDoctors(data);
    } catch (error) {
      console.error("Doctor fetch error:", error);
    }
  };

  return (
    <div className="admin-doctors-container">
      <div className="admin-doctors-header">
        <div>
          <h2>Doctors</h2>
          <p>Manage and view all registered doctors</p>
        </div>

        <span className="doctor-count">Total Doctors: {doctors.length}</span>
      </div>

      <div className="doctors-table-wrapper">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>#{doctor.id}</td>

                  <td className="doctor-name">{doctor.name}</td>

                  <td>{doctor.department}</td>

                  <td>{doctor.specialization}</td>

                  <td>{doctor.email}</td>

                  <td>{doctor.phone}</td>

                  <td>
                    <span
                      className={
                        doctor.active
                          ? "doctor-status active"
                          : "doctor-status inactive"
                      }
                    >
                      {doctor.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-doctors">
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctors;
