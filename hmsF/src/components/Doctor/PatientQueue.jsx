import {FiSearch, FiEye, FiPlay, FiCheckCircle,  } from "react-icons/fi";

function PatientQueue({searchTerm, filteredPatients, PriorityBadge, openPatient, setSearchTerm }){
    return(
        <>
          <section className="queue-section">
            <div className="section-header">
              <div>
                <h2>Assigned Patients Queue</h2>
                <p className="section-header__sub">Auto-assigned by disease category &amp; specialization match</p>
              </div>
              <div className="queue-search">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search patient, token or category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
 
            <div className="queue-table-wrap">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Disease Category</th>
                    <th>Time</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.token} className={p.status === "Completed" ? "row--completed" : ""}>
                      <td data-label="Token">
                        <span className="token-chip">{p.token}</span>
                      </td>
                      <td data-label="Patient">
                        <div className="patient-cell">
                          <span className="patient-cell__name">{p.name}</span>
                          <span className="patient-cell__meta">{p.gender}</span>
                        </div>
                      </td>
                      <td data-label="Age">{p.age}</td>
                      <td data-label="Disease Category">{p.category}</td>
                      <td data-label="Time">{p.time}</td>
                      <td data-label="Priority">
                        <PriorityBadge priority={p.priority} />
                      </td>
                      <td data-label="Actions">
                        <div className="row-actions">
                          <button className="icon-btn icon-btn--ghost" title="View details" onClick={() => openPatient(p.token, false)}>
                            <FiEye />
                          </button>
                          {p.status === "Completed" ? (
                            <span className="completed-tag">
                              <FiCheckCircle /> Done
                            </span>
                          ) : (
                            <button className="btn btn--primary btn--sm" onClick={() => openPatient(p.token, true)}>
                              <FiPlay />
                              {p.status === "In Consultation" ? "Continue" : "Start"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="queue-empty">
                        No patients match “{searchTerm}”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
    );
}

export default PatientQueue;