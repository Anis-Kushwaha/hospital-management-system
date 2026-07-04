import {
  FiX,
  FiUser,
  FiPhone,
  FiClock,
  FiFileText,
  FiDownload,
  FiClipboard,
  FiPlus,
  FiTrash2
} from "react-icons/fi";

function PatientDrawer({selectedPatient, closeDrawer, currentConsultation, AVAILABLE_TESTS, medForm, setMedForm, toggleTest, addPrescription, updateConsultation, setStage, selectedToken, removePrescription, PriorityBadge, StageTag }){
    return(
        <>
      {selectedPatient && (
        <div className="drawer-overlay" onClick={closeDrawer}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer__header">
              <div>
                <div className="drawer__title-row">
                  <h3>{selectedPatient.name}</h3>
                  <PriorityBadge priority={selectedPatient.priority} />
                  <StageTag stage={currentConsultation.stage} />
                </div>
                <p className="drawer__subtitle">
                  {selectedPatient.token} &middot; {selectedPatient.category}
                </p>
              </div>
              <button className="icon-btn" onClick={closeDrawer} aria-label="Close">
                <FiX />
              </button>
            </div>
 
            <div className="drawer__body">
              {/* Info grid */}
              <div className="info-grid">
                <div className="info-item">
                  <FiUser />
                  <div>
                    <span className="info-item__label">Age / Gender</span>
                    <span className="info-item__value">
                      {selectedPatient.age} yrs, {selectedPatient.gender}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <FiPhone />
                  <div>
                    <span className="info-item__label">Contact</span>
                    <span className="info-item__value">{selectedPatient.contact}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiClock />
                  <div>
                    <span className="info-item__label">Appointment</span>
                    <span className="info-item__value">{selectedPatient.time}</span>
                  </div>
                </div>
              </div>
 
              <div className="drawer__section">
                <h4>Symptoms</h4>
                <p>{selectedPatient.symptoms}</p>
              </div>
 
              <div className="drawer__section">
                <h4>Previous Medical History</h4>
                <p>{selectedPatient.history}</p>
              </div>
 
              <div className="drawer__section">
                <h4>Uploaded Reports</h4>
                {selectedPatient.reports.length === 0 ? (
                  <p className="drawer__empty">No reports uploaded yet.</p>
                ) : (
                  <ul className="report-list">
                    {selectedPatient.reports.map((r) => (
                      <li key={r} className="report-list__item">
                        <FiFileText />
                        <span>{r}</span>
                        <button className="icon-btn icon-btn--ghost" title="Download report">
                          <FiDownload />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
 
              <div className="drawer__section">
                <h4>Diagnosis</h4>
                <textarea
                  className="drawer__textarea"
                  placeholder="Enter diagnosis..."
                  value={currentConsultation.diagnosis}
                  onChange={(e) => updateConsultation(selectedToken, { diagnosis: e.target.value })}
                />
              </div>
 
              <div className="drawer__section">
                <h4>Doctor&apos;s Notes</h4>
                <textarea
                  className="drawer__textarea"
                  placeholder="Add consultation notes..."
                  value={currentConsultation.notes}
                  onChange={(e) => updateConsultation(selectedToken, { notes: e.target.value })}
                />
              </div>
 
              <div className="drawer__section">
                <h4>Recommend Tests</h4>
                <div className="test-grid">
                  {AVAILABLE_TESTS.map((test) => {
                    const Icon = test.icon;
                    const active = currentConsultation.tests.includes(test.label);
                    return (
                      <button
                        key={test.id}
                        className={`test-chip ${active ? "test-chip--active" : ""}`}
                        onClick={() => toggleTest(test.label)}
                        type="button"
                      >
                        <Icon />
                        {test.label}
                      </button>
                    );
                  })}
                </div>
                {currentConsultation.tests.length > 0 && (
                  <div className="selected-tests">
                    {currentConsultation.tests.map((t) => (
                      <span key={t} className="selected-tests__pill">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
 
              <div className="drawer__section">
                <h4>Prescription</h4>
                <div className="rx-form">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={medForm.name}
                    onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 500mg)"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 days)"
                    value={medForm.duration}
                    onChange={(e) => setMedForm({ ...medForm, duration: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Instructions (e.g. after food)"
                    value={medForm.instructions}
                    onChange={(e) => setMedForm({ ...medForm, instructions: e.target.value })}
                  />
                  <button className="btn btn--primary btn--sm rx-form__add" onClick={addPrescription} type="button">
                    <FiPlus /> Add
                  </button>
                </div>
 
                {currentConsultation.prescriptions.length > 0 && (
                  <div className="rx-preview">
                    <div className="rx-preview__title">
                      <FiClipboard /> Prescription Preview
                    </div>
                    {currentConsultation.prescriptions.map((rx) => (
                      <div className="rx-preview__item" key={rx.id}>
                        <div>
                          <span className="rx-preview__name">{rx.name}</span>
                          <span className="rx-preview__meta">
                            {rx.dosage}
                            {rx.duration ? ` · ${rx.duration}` : ""}
                          </span>
                          {rx.instructions && <span className="rx-preview__instructions">{rx.instructions}</span>}
                        </div>
                        <button className="icon-btn icon-btn--ghost" onClick={() => removePrescription(rx.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
 
            <div className="drawer__footer">
              <button className="btn btn--outline" onClick={() => setStage("Diagnosed")}>
                Mark as Diagnosed
              </button>
              <button className="btn btn--outline" onClick={() => setStage("Follow-up Required")}>
                Follow-up Required
              </button>
              <button className="btn btn--outline" onClick={() => setStage("Sent for Tests")}>
                Send for Tests
              </button>
              <button className="btn btn--success" onClick={() => setStage("Completed")}>
                Complete Consultation
              </button>
            </div>
          </div>
        </div>
      )}
        </>
    );
}

export default PatientDrawer;