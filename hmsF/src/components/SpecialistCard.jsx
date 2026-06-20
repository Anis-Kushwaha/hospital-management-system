import React from "react";

function SpecialistCard({doctor}){
    return (
    <div className="Specialist-card" id={`Doctor${doctor.id}`}>
      <div className={`Specialist-icon-wrapper ${doctor.iconClass}`}>
        <span className="Specialist-icon">{doctor.icon}</span>
      </div>
      <h3 className="Specialist-title">{doctor.name}</h3>
      <p className="Specialist-description">{doctor.description}</p>
      <a href={doctor.link} className="service-link">
        Learn More &rarr;
      </a>
    </div>
  );
}

export default SpecialistCard;