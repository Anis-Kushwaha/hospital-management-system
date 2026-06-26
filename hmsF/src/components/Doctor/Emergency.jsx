import React from "react";

function Emergency({emergencyAlerts,getSeverityClass}){
  return(
    <>
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
    </>
  );
}
export default Emergency ;