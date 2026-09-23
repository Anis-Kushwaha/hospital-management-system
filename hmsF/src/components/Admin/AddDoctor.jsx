import React, { useState } from "react";


const AddDoctor = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/admin/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctor),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add doctor");
      }

      const data = await response.json();

      console.log("Doctor created:", data);

      setMessage("Doctor added successfully!");

      setDoctor({
        name: "",
        email: "",
        password: "",
        department: "",
        specialization: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
      setMessage("Failed to add doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-doctor-container">
      <div className="add-doctor-card">
        <h2>Add Doctor</h2>

        <p className="add-doctor-subtitle">Create a new doctor account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor Name</label>

            <input
              type="text"
              name="name"
              value={doctor.name}
              onChange={handleChange}
              placeholder="Dr. Rahul Sharma"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={doctor.email}
              onChange={handleChange}
              placeholder="doctor@hospital.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              name="password"
              value={doctor.password}
              onChange={handleChange}
              placeholder="Enter login password"
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>

            <select
              name="department"
              value={doctor.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>

          <div className="form-group">
            <label>Specialization</label>

            <input
              type="text"
              name="specialization"
              value={doctor.specialization}
              onChange={handleChange}
              placeholder="e.g. Cardiologist"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={doctor.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
            />
          </div>

          <button type="submit" className="add-doctor-btn" disabled={loading}>
            {loading ? "Adding Doctor..." : "Add Doctor"}
          </button>

          {message && <p className="doctor-message">{message}</p>}
        </form>
      </div>
    </div>
    
  );
};

export default AddDoctor;
