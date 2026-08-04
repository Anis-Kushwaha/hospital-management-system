import {FiZap, FiActivity, FiFileText , FiClipboard, FiSend} from "react-icons/fi";

function PateintAI(){
    return(
        <>
            <div className="panel-card ai-card1">
              <div className="panel-card__header">
                <FiZap /> AI Medical Assistant
                <span className="ai-card1__badge">Preview</span>
              </div>
              <p className="ai-card1__desc">
                A clinical co-pilot designed to support faster, to provide more satisfaction.
              </p>
              <ul className="ai-card1__list">
                <li>
                  <FiActivity /> Suggest your health conditions
                </li>
                <li>
                  <FiFileText /> Summarize patient history
                </li>
                <li>
                  <FiClipboard /> Analyze your reports
                </li>
              </ul>
              <button className="btn btn--ai" disabled>
                <FiSend /> Feel free to ask Assistant
              </button>
            </div>
        </>
    );
}

export default PateintAI;