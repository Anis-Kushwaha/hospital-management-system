function WelcomeSection({todayLabel, DOCTOR, greeting, isAvailable, VitalLine}){
    return(
        <>
        <section className="welcome-section">
          <div className="welcome-section__text">
            <p className="welcome-section__eyebrow">{todayLabel}</p>
            <h1>
              {greeting}, {DOCTOR.name}
              <span className="welcome-section__spec">{DOCTOR.specialization}</span>
            </h1>
            <div className="welcome-section__status">
              <span className={`status-dot ${isAvailable ? "status-dot--on" : "status-dot--off"}`} />
              Status: <strong>{isAvailable ? "Available" : "Offline"}</strong>
            </div>
          </div>
          <VitalLine className="welcome-section__vital" />
        </section>
        </>
    );
}

export default WelcomeSection;