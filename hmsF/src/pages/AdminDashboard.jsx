import { useState } from "react";
import "../AdminAppointments.css";
import "../AddDoctor.css";
import "../AdminDoctors.css"
import AdminAppointments from "../components/Admin/AdminAppointments";
import AddDoctor from "../components/Admin/AddDoctor";
import AdminDoctors from "../components/Admin/AdminDoctors";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("appointments");

  return (
    <>
      <div className="admin-dashboard">
        {/* Admin Navigation */}
        <div className="admin-nav">
          <button onClick={() => setActiveSection("appointments")}>
            Appointments
          </button>

          <button onClick={() => setActiveSection("addDoctor")}>
            Add Doctor
          </button>

          <button onClick={() => setActiveSection("viewDoctor")}>
            View All Doctors
          </button>
        </div>

        {/* Dashboard Content */}

        {activeSection === "appointments" && <AdminAppointments />}

        {activeSection === "addDoctor" && <AddDoctor />}

        {activeSection === "viewDoctor" && <AdminDoctors/>}
      </div>
    </>
  );
}

export default AdminDashboard;
