import React from "react";

function ServiceCard({ service }) {
  return (
    <>
    <div className="service-card">
      <div className="service-card-inner">
            <div className="service-card-front" id={`service-${service.id}`}>
            <div className={`service-icon-wrapper ${service.iconClass}`}>
                <span className="service-icon">{service.icon}</span>
            </div>
            
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>

            </div>
            <div className="service-card-back">
            {service.image && (<img src={service.image} alt={service.title} className="service-back-img" />)}
            <a href={service.link} className="service-link">Learn More &rarr;</a>
            </div>
        </div>
    </div>
    </>
  );
}

export default ServiceCard;