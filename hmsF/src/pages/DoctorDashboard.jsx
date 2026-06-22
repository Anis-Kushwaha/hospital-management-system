import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import Notification from "../components/Notification";
import '../DoctorDashboard.css';

function DoctorDashboard(){
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(false);

  // Dummy doctor data
  const doctorData = {
    name: 'Dr. Anis Kushwaha',
    specialization: 'BHAGWAN',
    profileImage: '👨‍⚕️',
    status: 'Online',
  };

  // Dummy statistics
  const stats = [
    { icon: '👥', number: '248', label: 'Total Patients', growth: '+12%' },
    { icon: '📅', number: '12', label: "Today's Appointments", growth: '+5%' },
    { icon: '📋', number: '8', label: 'Pending Reports', growth: '-2%' },
    { icon: '🚨', number: '3', label: 'Emergency Cases', growth: '+1%' },
  ];

  // Dummy appointments
  const appointments = [
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      department: 'Cardiology',
      time: '10:00 AM',
      status: 'Confirmed',
    },
    {
      id: 2,
      name: 'Emma Wilson',
      age: 32,
      department: 'Cardiology',
      time: '11:30 AM',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'Michael Brown',
      age: 58,
      department: 'Cardiology',
      time: '2:00 PM',
      status: 'Confirmed',
    },
    {
      id: 4,
      name: 'Lisa Davis',
      age: 28,
      department: 'Cardiology',
      time: '3:30 PM',
      status: 'Completed',
    },
  ];

  // Dummy patient records
  const patients = [
    {
      id: 1,
      name: 'Robert Johnson',
      age: 52,
      bloodGroup: 'O+',
      lastVisit: '2024-01-15',
      image: '👨',
    },
    {
      id: 2,
      name: 'Jennifer Lee',
      age: 41,
      bloodGroup: 'A+',
      lastVisit: '2024-01-10',
      image: '👩',
    },
    {
      id: 3,
      name: 'David Martinez',
      age: 67,
      bloodGroup: 'B+',
      lastVisit: '2024-01-08',
      image: '👨',
    },
  ];

  // Dummy emergency alerts
  const emergencyAlerts = [
    {
      id: 1,
      name: 'Thomas Green',
      type: 'Chest Pain',
      severity: 'Critical',
      time: '5 mins ago',
    },
    {
      id: 2,
      name: 'Patricia White',
      type: 'Shortness of Breath',
      severity: 'High',
      time: '15 mins ago',
    },
    {
      id: 3,
      name: 'Charles Harris',
      type: 'Irregular Heartbeat',
      severity: 'Medium',
      time: '1 hour ago',
    },
    
  ];

  // Dummy notifications
  const notifications = [
    { id: 1, type: 'Appointment', message: 'New appointment request from Mark Taylor', time: '2 mins ago' },
    { id: 2, type: 'Emergency', message: 'Emergency alert: Patient admitted', time: '10 mins ago' },
    { id: 3, type: 'Report', message: 'Lab report ready for review', time: '30 mins ago' },
    { id: 4, type: 'Reminder', message: 'Follow-up call due for James Anderson', time: '1 hour ago' },
  ];

  // Dummy schedule
  const schedule = [
    { time: '9:00 AM', status: 'Available' },
    { time: '11:00 AM', status: 'Busy' },
    { time: '12:00 PM', status: 'Available' },
    { time: '1:00 PM', status: 'Lunch Break' },
    { time: '2:00 PM', status: 'Busy' },
    { time: '4:00 PM', status: 'Available' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'Pending':
        return 'status-pending';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'severity-critical';
      case 'High':
        return 'severity-high';
      case 'Medium':
        return 'severity-medium';
      default:
        return '';
    }
  };

  const sidebarMenus = [
    'Dashboard',
    'Appointments',
    'Patients',
    'Medical Records',
    'Prescriptions',
    'Schedule',
    'Emergency Alerts',
  ];

  return (
    <>
      <div className={`doctor-dashboard ${darkMode ? "dark-mode" : ""}`}>
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="doctor-profile-card">
              <div className="profile-image">{doctorData.profileImage}</div>
              <div className="profile-info">
                <h3 className="doctor-name">{doctorData.name}</h3>
                <p className="doctor-specialization">{doctorData.specialization}</p>
                  <div className="doctor-status-container">
                      <span className={`status-badge ${isOnline ? "online" : "offline"}`}>
                          ● {isOnline ? "Online" : "Offline"}
                      </span>
                      <div className={`status-toggle ${isOnline ? "active" : ""}`} onClick={() => setIsOnline(!isOnline)}>
                          <div className="status-toggle-circle"></div>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <nav className="sidebar-menu">
            {sidebarMenus.map((menu) => (
              <button
                key={menu}
                className={`menu-item ${activeMenu === menu ? 'active' : ''}`}
                onClick={() => setActiveMenu(menu)}
              >
                {menu}
              </button>
            ))}
          </nav>

          <button className="logout-btn"   onClick={() => navigate("/")} >Logout</button>
        </aside>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Header */}
          <header className="dashboard-header">
            <div className="header-left">
              <h1 className="dashboard-title">Dashboard</h1>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="header-right">
              <button className="notification-btn" onClick={() => setNotification(true)} >🔔</button>
              <div className={`theme-toggle ${darkMode ? "active" : ""}`} onClick={() => setDarkMode(!darkMode)}>
                <div className="theme-toggle-circle">{darkMode ? <FaMoon /> : <FaSun />}</div>
              </div>
              <div className="profile-section">
                  <span className="profile-initial">
                      {doctorData.name
                      .split(' ')
                      .map(word => word[0])
                      .slice(1)
                      .join('')}
                  </span>
              </div>
            </div>
          </header>

          {/* Statistics Cards */}
          <section className="stats-section">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{stat.number}</h3>
                    <p className="stat-label">{stat.label}</p>
                    <span className={`growth-indicator ${stat.growth.startsWith('+') ? 'positive' : 'negative'}`}>
                      {stat.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Today's Appointments */}
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

              {/* Emergency Alerts */}
              <section className="emergency-section">
                <div className="section-header">
                  <h2>Emergency Alerts</h2>
                </div>
                <div className="emergency-grid">
                  {emergencyAlerts.map((alert) => (
                    <div key={alert.id} className={`emergency-card ${getSeverityClass(alert.severity)}`}>
                      <div className="alert-header">
                        <h4>{alert.name}</h4>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                      <p className="alert-type">{alert.type}</p>
                      <div className="alert-footer">
                        <span className="severity-label">{alert.severity}</span>
                        <button className="btn-respond">Respond Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Patient Records */}
              <section className="patients-section">
                <div className="section-header">
                  <h2>Patient Records</h2>
                  <a href="#" className="view-all">View All</a>
                </div>
                <div className="patients-container">
                  {patients.map((patient) => (
                    <div key={patient.id} className="patient-card">
                      <div className="patient-image">{patient.image}</div>
                      <div className="patient-info">
                        <h4 className="patient-name">{patient.name}</h4>
                        <p className="patient-detail">Age: {patient.age}</p>
                        <p className="patient-detail">Blood: {patient.bloodGroup}</p>
                        <p className="patient-detail">Last Visit: {patient.lastVisit}</p>
                      </div>
                      <button className="btn-view-record">View Record</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Schedule */}
              <section className="schedule-section">
                <div className="section-header">
                  <h2>Daily Schedule</h2>
                </div>
                <div className="schedule-list">
                  {schedule.map((slot, index) => (
                    <div
                      key={index}
                      className={`schedule-item ${slot.status === 'Busy' ? 'busy' : slot.status === 'Lunch Break' ? 'break' : 'available'}`}
                    >
                      <span className="time">{slot.time}</span>
                      <span className="slot-status">{slot.status}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Notifications Panel */}

            </div>
          </div>

          {/* Quick Actions */}
          <section className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">💊 Add Prescription</button>
              <button className="action-btn">📋 Create Medical Record</button>
              <button className="action-btn">📊 View Reports</button>
              <button className="action-btn">📞 Contact Patient</button>
              <button className="action-btn">🎥 Start Video Consultation</button>
            </div>
          </section>
        </div>
      </div>
      {notification  && ( <Notification notifications={notifications} onClose={() => setNotification(false)} /> )}
    </>
  );
}

export default DoctorDashboard;