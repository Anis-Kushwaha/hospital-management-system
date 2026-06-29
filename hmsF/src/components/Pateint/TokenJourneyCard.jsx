import React from "react";
import { useState,useEffect } from "react";

function TokenJourneyCard({APPOINTMENT, TOKEN}) {
  const [animated, setAnimated] = useState(false);
 
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);
 
  const progressPct =  TOKEN.mine > 0?  Math.max(0,Math.min(Math.round((TOKEN.serving / TOKEN.mine) * 100), 100)): 0;
  const patientsAhead = Math.max(TOKEN.mine - TOKEN.serving - 1,0);
  // SVG arc params
  const cx = 98, cy = 98, r = 78;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - (animated ? progressPct / 100 : 0));
 
  return (
    <article className="pd-token-card" aria-label="Queue status and token journey">
      <div className="pd-token-header">
        <div>
          <p className="pd-eyebrow">Live Queue Status</p>
          <h2 className="pd-card-title">Your Appointment Journey</h2>
        </div>
        <span className="pd-live-badge" role="status" aria-live="polite">
          <span className="pd-live-dot" aria-hidden="true" />
          Live
        </span>
      </div>
 
      <div className="pd-token-body">
        {/* Arc */}
        <div className="pd-arc-container" role="img" aria-label={`Your token number ${TOKEN.mine}, ${progressPct}% through queue`}>
          <svg className="pd-arc-svg" viewBox="0 0 196 196">
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} className="pd-arc-track" />
            {/* Progress */}
            <circle
              cx={cx} cy={cy} r={r}
              className="pd-arc-fill"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: dashOffset,
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
                transition: animated
                  ? 'stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)'
                  : 'none',
              }}
            />
            {/* Subtle glow circle */}
            <circle
              cx={cx} cy={cy} r={r - 4}
              fill="none"
              stroke="rgba(27,111,235,0.06)"
              strokeWidth="22"
            />
          </svg>
 
          <div className="pd-arc-center">
            <span className="pd-arc-eyebrow">Your Token</span>
            <span className="pd-arc-token">#{TOKEN.mine}</span>
            <span className="pd-arc-progress">{progressPct}% Complete</span>
          </div>
        </div>
 
        {/* Stat pills */}
        <div className="pd-token-stats">
          <div className="pd-tstat pd-tstat-featured">
            <span className="pd-tstat-val">#{TOKEN.serving}</span>
            <span className="pd-tstat-label">Now Serving</span>
          </div>
          <div className="pd-tstat">
            <span className="pd-tstat-val pd-tstat-val-danger">{patientsAhead}</span>
            <span className="pd-tstat-label">Patients Ahead</span>
          </div>
          <div className="pd-tstat">
            <span className="pd-tstat-val">{TOKEN.estimatedWait} Min</span>
            <span className="pd-tstat-label">Estimated Wait</span>
          </div>
        </div>
      </div>
 
      {/* Progress bar */}
      <div className="pd-token-footer">
        <div className="pd-progress-meta">
          <span className="pd-progress-meta-label">Serving #{TOKEN.serving}</span>
          <span className="pd-progress-meta-val">Your Token #{TOKEN.mine}</span>
        </div>
        <div className="pd-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="pd-progress-fill"
            style={{ width: animated ? `${progressPct}%` : '0%' }}
          >
            <div className="pd-progress-knob" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default TokenJourneyCard;