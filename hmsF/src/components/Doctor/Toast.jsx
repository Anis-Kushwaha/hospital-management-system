import {FiCheckCircle} from "react-icons/fi";

function Toast({toast}){
    return(
        <>
      {toast && (
        <div className="toast">
          <FiCheckCircle />
          <span>{toast}</span>
        </div>
      )}
        </>
    );
}

export default Toast;