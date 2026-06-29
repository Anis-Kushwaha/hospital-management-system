import React from "react";

function HealthInsightsCard({HEALTH_TIPS}) {
  return (
    <article className="pd-card" aria-label="Health insights and reminders">
      <div className="pd-card-header">
        <div>
          <p className="pd-eyebrow">Today</p>
          <h2 className="pd-card-title" style={{ fontSize: '16px' }}>Health Insights</h2>
        </div>
      </div>
 
      <ul className="pd-insights-list" role="list">
        {HEALTH_TIPS.map((tip, i) => (
          <li key={i} className={`pd-insight-item pd-insight-${tip.type}`}>
            <span className="pd-insight-emoji" aria-hidden="true">{tip.emoji}</span>
            <div className="pd-insight-content">
              <p className="pd-insight-title">{tip.title}</p>
              <p className="pd-insight-desc">{tip.desc}</p>
              {tip.progress !== undefined && (
                <div className="pd-insight-bar" role="progressbar" aria-valuenow={tip.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Hydration: ${tip.progress}%`}>
                  <div className="pd-insight-bar-fill" style={{ width: `${tip.progress}%` }} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default HealthInsightsCard;