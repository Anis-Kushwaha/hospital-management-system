import React from "react";
import { CheckCircle, Activity, User, Calendar, } from 'lucide-react';

function PatientAppointmentCard({APPOINTMENT}) {
  return (
    <article className="pd-card" aria-label="Appointment details">
      <div className="pd-card-header">
        <div>
          <p className="pd-eyebrow">Upcoming Visit</p>
          <h2 className="pd-card-title">Appointment Details</h2>
        </div>
        <span className="pd-status-badge pd-status-confirmed">
          <CheckCircle size={11} aria-hidden="true" />
          {APPOINTMENT.status}
        </span>
      </div>
 
      <div className="pd-appt-grid">
        {/* Featured row */}
        <div className="pd-appt-featured">
          <div className="pd-date-block" aria-label={`Date: ${APPOINTMENT.date}`}>
            <span className="pd-date-day">{APPOINTMENT.day}</span>
            <span className="pd-date-month">{APPOINTMENT.month}</span>
          </div>
          <div className="pd-appt-time-block">
            <div className="pd-appt-time">{APPOINTMENT.time}</div>
            <div className="pd-appt-room">{APPOINTMENT.room}</div>
          </div>
        </div>
 
        {/* Detail cells */}
        <div className="pd-appt-detail">
          <Activity size={14} className="pd-appt-detail-icon" aria-hidden="true" />
          <div>
            <span className="pd-detail-label">Department</span>
            <span className="pd-detail-val">{APPOINTMENT.department}</span>
          </div>
        </div>
 
        <div className="pd-appt-detail">
          <User size={14} className="pd-appt-detail-icon" aria-hidden="true" />
          <div>
            <span className="pd-detail-label">Doctor</span>
            <span className="pd-detail-val">{APPOINTMENT.doctor}</span>
          </div>
        </div>
 
        <div className="pd-appt-detail">
          <Calendar size={14} className="pd-appt-detail-icon" aria-hidden="true" />
          <div>
            <span className="pd-detail-label">Hospital</span>
            <span className="pd-detail-val">{APPOINTMENT.hospital}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PatientAppointmentCard;