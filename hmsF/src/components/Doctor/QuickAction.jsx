import React from "react";

function QuickAction(){
    return(
        <>
        <section className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">💊 Add Prescription</button>
              <button className="action-btn">📋 Create Medical Record</button>
              <button className="action-btn">📊 View Reports</button>
              <button className="action-btn">📞 Contact Patient</button>
              <button className="action-btn">🎥 Start Video Consultation</button>
            </div>
        </section>
        </>
    );
}

export default QuickAction;