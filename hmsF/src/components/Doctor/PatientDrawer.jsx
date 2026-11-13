import {
  FiX,
  FiUser,
  FiPhone,
  FiClock,
  FiFileText,
  FiDownload,
  FiClipboard,
  FiPlus,
  FiTrash2,
  FiSave,
} from "react-icons/fi";

function PatientDrawer({
  selectedPatient,
  closeDrawer,
  currentConsultation,
  AVAILABLE_TESTS,
  medForm,
  setMedForm,
  toggleTest,
  addPrescription,
  setStage,
  selectedToken,
  removePrescription,
  PriorityBadge,
  StageTag,
  onSaveConsultation,
  consultationLoading,
  consultationSaving,
  updateConsultation,
}) {
  if (!selectedPatient) return null;

  const isCompleted = selectedPatient.status === "COMPLETED";
  const isInConsultation = selectedPatient.status === "IN_CONSULTATION";

  const reports = selectedPatient.reports || [];

  return (
    <div className="drawer-overlay" onClick={closeDrawer}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__header">
          <div>
            <div className="drawer__title-row">
              <h3>{selectedPatient.name}</h3>
              <PriorityBadge priority={selectedPatient.priority} />
              <StageTag
                stage={
                  selectedPatient.status === "COMPLETED"
                    ? "Completed"
                    : selectedPatient.status === "IN_CONSULTATION"
                      ? "In Consultation"
                      : selectedPatient.status === "DOCTOR_ASSIGNED"
                        ? "Doctor Assigned"
                        : selectedPatient.status
                }
              />
            </div>

            <p className="drawer__subtitle">
              {selectedPatient.token} · {selectedPatient.department}
            </p>
          </div>

          <button className="icon-btn" onClick={closeDrawer} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="drawer__body">
          <div className="info-grid">
            <div className="info-item">
              <FiUser />
              <div>
                <span className="info-item__label">Patient</span>
                <span className="info-item__value">{selectedPatient.name}</span>
              </div>
            </div>

            <div className="info-item">
              <FiPhone />
              <div>
                <span className="info-item__label">Contact</span>
                <span className="info-item__value">
                  {selectedPatient.phone || "Not provided"}
                </span>
              </div>
            </div>

            <div className="info-item">
              <FiClock />
              <div>
                <span className="info-item__label">Appointment</span>
                <span className="info-item__value">
                  {selectedPatient.date} · {selectedPatient.slot}
                </span>
              </div>
            </div>
          </div>

          <div className="drawer__section">
            <h4>Reason for Appointment</h4>
            <p>{selectedPatient.reason || "Not provided"}</p>
          </div>

          <div className="drawer__section">
            <h4>Uploaded Reports</h4>

            {reports.length === 0 ? (
              <p className="drawer__empty">No reports uploaded yet.</p>
            ) : (
              <ul className="report-list">
                {reports.map((report) => (
                  <li key={report} className="report-list__item">
                    <FiFileText />
                    <span>{report}</span>
                    <button
                      className="icon-btn icon-btn--ghost"
                      title="Download report"
                      type="button"
                    >
                      <FiDownload />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {consultationLoading ? (
            <div className="drawer__section">
              <p>Loading consultation...</p>
            </div>
          ) : (
            <>
              <div className="drawer__section">
                <h4>Diagnosis</h4>

                <textarea
                  className="drawer__textarea"
                  placeholder="Enter diagnosis..."
                  maxLength={2000}
                  value={currentConsultation.diagnosis}
                  disabled={!isInConsultation || isCompleted}
                  onChange={(e) =>
                    updateConsultation(selectedToken, {
                      diagnosis: e.target.value,
                    })
                  }
                />
              </div>

              <div className="drawer__section">
                <h4>Doctor's Notes</h4>

                <textarea
                  className="drawer__textarea"
                  placeholder="Add consultation notes..."
                  maxLength={4000}
                  value={currentConsultation.notes}
                  disabled={!isInConsultation || isCompleted}
                  onChange={(e) =>
                    updateConsultation(selectedToken, {
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <div className="drawer__section">
                <h4>Recommend Tests</h4>

                <div className="test-grid">
                  {AVAILABLE_TESTS.map((test) => {
                    const Icon = test.icon;

                    const active = currentConsultation.tests.includes(
                      test.label,
                    );

                    return (
                      <button
                        key={test.id}
                        type="button"
                        disabled={!isInConsultation || isCompleted}
                        className={`test-chip ${
                          active ? "test-chip--active" : ""
                        }`}
                        onClick={() => toggleTest(test.label)}
                      >
                        <Icon />
                        {test.label}
                      </button>
                    );
                  })}
                </div>

                {currentConsultation.tests.length > 0 && (
                  <div className="selected-tests">
                    {currentConsultation.tests.map((test) => (
                      <span key={test} className="selected-tests__pill">
                        {test}
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
                    disabled={!isInConsultation || isCompleted}
                    onChange={(e) =>
                      setMedForm({
                        ...medForm,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Dosage (e.g. 500mg)"
                    value={medForm.dosage}
                    disabled={!isInConsultation || isCompleted}
                    onChange={(e) =>
                      setMedForm({
                        ...medForm,
                        dosage: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 days)"
                    value={medForm.duration}
                    disabled={!isInConsultation || isCompleted}
                    onChange={(e) =>
                      setMedForm({
                        ...medForm,
                        duration: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Instructions"
                    value={medForm.instructions}
                    disabled={!isInConsultation || isCompleted}
                    onChange={(e) =>
                      setMedForm({
                        ...medForm,
                        instructions: e.target.value,
                      })
                    }
                  />

                  <button
                    className="btn btn--primary btn--sm rx-form__add"
                    onClick={addPrescription}
                    disabled={!isInConsultation || isCompleted}
                    type="button"
                  >
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

                          {rx.instructions && (
                            <span className="rx-preview__instructions">
                              {rx.instructions}
                            </span>
                          )}
                        </div>

                        <button
                          className="icon-btn icon-btn--ghost"
                          type="button"
                          onClick={() => removePrescription(rx.id)}
                          disabled={!isInConsultation || isCompleted}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="drawer__footer">
          {!isCompleted && isInConsultation && (
            <>
              <button
                className="btn btn--primary"
                onClick={onSaveConsultation}
                disabled={consultationSaving || consultationLoading}
              >
                <FiSave />
                {consultationSaving ? "Saving..." : "Save Diagnosis & Notes"}
              </button>

              <button
                className="btn btn--success"
                onClick={() => setStage("Completed")}
                disabled={consultationSaving || consultationLoading}
              >
                Complete Consultation
              </button>
            </>
          )}

          {!isCompleted && selectedPatient.status === "DOCTOR_ASSIGNED" && (
            <p className="drawer__empty">
              Start the consultation before entering diagnosis and notes.
            </p>
          )}

          {isCompleted && (
            <p className="drawer__empty">
              This consultation has been completed. Details are read-only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDrawer;
