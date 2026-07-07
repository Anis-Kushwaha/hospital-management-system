import React from "react";
import { Calendar, CheckCircle, Bell, Phone, CreditCard, Heart } from 'lucide-react';
import { FiLogOut} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function PatientHeroSection({PATIENT, APPOINTMENT}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <section className="pd-hero" aria-label="Patient overview">
        <div className="pd-hero-orb1" aria-hidden="true" />
        <div className="pd-hero-orb2" aria-hidden="true" />
  
        <div className="pd-hero-inner">
          {/* LEFT */}
          <div className="pd-hero-left">
            <div className="pd-health-pill" aria-label={`Health status: ${PATIENT.healthStatus}`}>
              <span className="pd-health-dot" />
              {PATIENT.healthStatus} Health
            </div>
  
            <h1 className="pd-hero-name">
              Welcome Back, {PATIENT.name} 👋
            </h1>
            <p className="pd-patient-id">Token Number: {PATIENT.id}</p>
  
            <div className="pd-appt-chip" aria-label="Next appointment details">
              <Calendar size={14} className="pd-appt-chip-icon" aria-hidden="true" />
              <span>Next Appointment — {APPOINTMENT.date} · {APPOINTMENT.time}</span>
              <span className="pd-confirmed-pill">
                <CheckCircle size={10} aria-hidden="true" />
                Confirmed
              </span>
            </div>
  
            <div className="pd-hero-actions">
              <button className="pd-hero-btn pd-hero-btn-white" aria-label="View reminders">
                <Bell size={14} aria-hidden="true" />
                Reminders
              </button>
              <button className="pd-hero-btn pd-hero-btn-ghost" aria-label="Call clinic">
                <Phone size={14} aria-hidden="true" />
                Call Clinic
              </button>
              <a href="#Payment" className="pd-hero-btn pd-hero-btn-ghost" aria-label="Pay bill">
                <CreditCard size={14} aria-hidden="true" />
                Pay Bill
              </a>
            </div>
          </div>
  
          {/* RIGHT */}
          <div className="pd-hero-right">
            <div className="pd-avatar-shell">
              <div className="pd-avatar" role="img" aria-label={`Avatar for ${PATIENT.name}`}>
                {PATIENT.name[0]}
              </div>
              <div className="pd-avatar-badge" aria-hidden="true">
                <Heart size={12} />
              </div>
            </div>
  
            <div className="pd-hero-vitals">
              <div className="pd-vital">
                <span className="pd-vital-val">{PATIENT.bloodGroup}</span>
                <span className="pd-vital-label">Blood Group</span>
              </div>
              <div className="pd-vital-divider" />
              <div className="pd-vital">
                <span className="pd-vital-val">{PATIENT.age}</span>
                <span className="pd-vital-label">Age</span>
              </div>
            </div>
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default PatientHeroSection;