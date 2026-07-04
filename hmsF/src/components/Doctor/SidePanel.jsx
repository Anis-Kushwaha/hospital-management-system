import {FiCalendar, FiZap, FiActivity, FiFileText, FiClipboard, FiSend} from "react-icons/fi";

function SidePanel({TODAY_SCHEDULE, }){
    return(
        <>
          <aside className="side-panel">
            <div className="panel-card">
              <div className="panel-card__header">
                <FiCalendar /> Today&apos;s Schedule
              </div>
              <ul className="schedule-list">
                {TODAY_SCHEDULE.map((item, idx) => (
                  <li key={idx} className="schedule-list__item">
                    <span className="schedule-list__time">{item.time}</span>
                    <span className="schedule-list__info">
                      <span className="schedule-list__name">{item.patient}</span>
                      <span className="schedule-list__type">{item.type}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
 
            <div className="panel-card ai-card">
              <div className="panel-card__header">
                <FiZap /> AI Medical Assistant
                <span className="ai-card__badge">Preview</span>
              </div>
              <p className="ai-card__desc">
                A clinical co-pilot designed to support faster, more confident decisions during consultations.
              </p>
              <ul className="ai-card__list">
                <li>
                  <FiActivity /> Suggest possible diagnoses
                </li>
                <li>
                  <FiFileText /> Summarize patient history
                </li>
                <li>
                  <FiClipboard /> Analyze uploaded reports
                </li>
              </ul>
              <button className="btn btn--ai" disabled>
                <FiSend /> Ask Assistant
              </button>
            </div>
          </aside>
        </>
    );
}

export default SidePanel;