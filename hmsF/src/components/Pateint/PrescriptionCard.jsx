import React from "react";
import { ChevronRight, Pill, Download,  } from 'lucide-react';

function PrescriptionCard({PRESCRIPTIONS}) {
  return (
    <article className="pd-card" aria-label="Prescription history">
      <div className="pd-card-header">
        <div>
          <p className="pd-eyebrow">Medical Records</p>
          <h2 className="pd-card-title">Prescriptions</h2>
        </div>
        <button className="pd-see-all" aria-label="View all prescriptions">
          View All <ChevronRight size={12} style={{ display: 'inline' }} />
        </button>
      </div>
 
      <ul className="pd-rx-list" role="list">
        {PRESCRIPTIONS.map((rx) => (
          <li key={rx.id} className="pd-rx-item">
            <div className="pd-rx-icon" aria-hidden="true">
              <Pill size={16} />
            </div>
            <div className="pd-rx-info">
              <span className="pd-rx-name">{rx.name}</span>
              <span className="pd-rx-meta">{rx.date} · {rx.doctor}</span>
            </div>
            <div className="pd-rx-right">
              <span className={`pd-rx-status ${rx.status === 'Active' ? 'pd-rx-active' : 'pd-rx-done'}`}>
                {rx.status}
              </span>
              <button
                className="pd-dl-btn"
                aria-label={`Download prescription for ${rx.name}`}
                title="Download prescription"
              >
                <Download size={13} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default PrescriptionCard;