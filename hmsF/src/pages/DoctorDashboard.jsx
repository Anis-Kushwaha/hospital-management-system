import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import Notification from "../components/Doctor/Notification";
import '../DoctorDashboard.css';
import AppointmentsSection from "../components/Doctor/AppointmentsSection";
import Emergency from "../components/Doctor/Emergency";
import StatusGrid from "../components/Doctor/StatusGrid";
import QuickAction from "../components/Doctor/QuickAction";
import ScheduleSection from "../components/Doctor/ScheduleSection";
import PatientsSection from "../components/Doctor/PatientsSection";

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

function DoctorDashboard(){
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(false);

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
              <h1 className="dashboard-title">{activeMenu}</h1>
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
          <StatusGrid stats={stats} />

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Today's Appointments */}
              <AppointmentsSection appointments={appointments} isOnline={isOnline} getStatusClass={getStatusClass} />

              {/* Emergency Alerts */}
              <Emergency   emergencyAlerts={emergencyAlerts} getSeverityClass={getSeverityClass}/>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Patient Records */}
              <PatientsSection patients = {patients} />

              {/* Schedule */}
              <ScheduleSection schedule={schedule} />

              {/* Notifications Panel */}

            </div>
          </div>

          {/* Quick Actions */}
          <QuickAction/>
        </div>
      </div>
      {notification  && ( <Notification notifications={notifications} onClose={() => setNotification(false)} /> )}
    </>
  );
}

export default DoctorDashboard;