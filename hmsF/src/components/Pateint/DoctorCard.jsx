import React from "react";
import { Star, Clock, Phone } from 'lucide-react';

function DoctorCard({DOCTOR}) {
  return (
    <article className="pd-card pd-doctor-card" aria-label="Assigned doctor profile">
      <p className="pd-eyebrow">Your Physician</p>
 
      <div className="pd-doc-avatar-wrap">
        <div className="pd-doc-avatar" role="img" aria-label={`Dr. ${DOCTOR.name} avatar`}>
          {DOCTOR.initials}
        </div>
        <span className="pd-doc-avail-pill" role="status">
          <span className="pd-avail-dot" aria-hidden="true" />
          Available Today
        </span>
      </div>
 
      <h3 className="pd-doc-name">{DOCTOR.name}</h3>
      <p className="pd-doc-spec">{DOCTOR.specialty}</p>
 
      <div className="pd-doc-stats" role="list" aria-label="Doctor statistics">
        <div className="pd-doc-stat" role="listitem">
          <span className="pd-doc-stat-val">{DOCTOR.experience}+</span>
          <span className="pd-doc-stat-label">Years</span>
        </div>
        <div className="pd-doc-stat-divider" aria-hidden="true" />
        <div className="pd-doc-stat" role="listitem">
          <Star size={13} className="pd-star-icon" aria-hidden="true" />
          <span className="pd-doc-stat-val">{DOCTOR.rating}</span>
          <span className="pd-doc-stat-label">Rating</span>
        </div>
        <div className="pd-doc-stat-divider" aria-hidden="true" />
        <div className="pd-doc-stat" role="listitem">
          <span className="pd-doc-stat-val">{DOCTOR.reviews}</span>
          <span className="pd-doc-stat-label">Reviews</span>
        </div>
      </div>
 
      <div className="pd-doc-slot">
        <Clock size={13} aria-hidden="true" />
        <span>Your Slot: {DOCTOR.nextSlot}</span>
      </div>
 
      <button className="pd-contact-btn" aria-label={`Contact ${DOCTOR.name}`}>
        <Phone size={14} aria-hidden="true" />
        Contact Doctor
      </button>
    </article>
  );
}

export default DoctorCard;