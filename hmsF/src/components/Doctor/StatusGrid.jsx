import React from "react";

function StatusGrid({stats}){
    return(
        <>
        <section className="stats-section">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <h3 className="stat-number">{stat.number}</h3>
                    <p className="stat-label">{stat.label}</p>
                    <span className={`growth-indicator ${stat.growth.startsWith('+') ? 'positive' : 'negative'}`}>
                      {stat.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
        </section>
        </>
    );
}

export default StatusGrid;