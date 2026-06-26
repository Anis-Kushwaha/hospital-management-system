import React from "react";

function ScheduleSection({schedule}){
    return(
        <>
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
        </>
    );
}

export default ScheduleSection;