import {FiAlertTriangle, FiClock, FiChevronRight} from "react-icons/fi";

function EmergencySection({emergencyPatients, openPatient}){
    return(
        <>
        {emergencyPatients.length > 0 && (
          <section className="emergency-section">
            <div className="emergency-section__header">
              <FiAlertTriangle />
              <h2>Emergency Alerts</h2>
              <span className="emergency-section__count">{emergencyPatients.length}</span>
            </div>
            <div className="emergency-scroll">
              {emergencyPatients.map((p) => (
                <div className="emergency-card" key={p.token}>
                  <div className="emergency-card__top">
                    <span className="emergency-card__name">{p.name}</span>
                    <span className="emergency-card__token">{p.token}</span>
                  </div>
                  <p className="emergency-card__type">{p.category}</p>
                  <div className="emergency-card__meta">
                    <FiClock /> Arrived {p.time}
                  </div>
                  <button className="btn btn--emergency" onClick={() => openPatient(p.token, true)}>
                    Attend Now <FiChevronRight />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        </>
    );
}

export default EmergencySection;