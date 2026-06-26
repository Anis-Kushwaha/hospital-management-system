import React from "react";

function PatientsSection ({patients}){
    return(
        <>
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
        </>
    );
}

export default PatientsSection;