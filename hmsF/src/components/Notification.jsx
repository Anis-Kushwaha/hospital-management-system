import React from "react";
import '../DoctorDashboard.css';

function Notification({ notifications, onClose }){


    return(
        <>
    <div className="notification-popup">
        <div className="close-btn" onClick={onClose}>&times;</div>
              <section className="notifications-section">
                <div className="section-header">
                  <h2>Notifications</h2>
                </div>
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="notification-item">
                      <span className="notification-type">{notif.type}</span>
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </section>
    </div>
        </>
    );
}

export default Notification;