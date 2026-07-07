import {FiBell, FiLogOut} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function DoctorNavbar({VitalLine, isAvailable, setIsAvailable, NOTIFICATIONS, unreadNotifications, showNotifications, setShowNotifications, notifRef, DOCTOR, showToast}){
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
        <>
      <header className="dd-navbar">
        <div className="dd-navbar__brand">
          <span className="dd-logo-mark">
            <VitalLine />
          </span>
          <span className="dd-logo-text">
            MediCare <span>+</span> <small>Doctor Dashboard</small>
          </span>
        </div>
 
        <div className="dd-navbar__actions">
          <button
            className={`avail-toggle ${isAvailable ? "avail-toggle--on" : "avail-toggle--off"}`}
            onClick={() => setIsAvailable((v) => !v)}
            title="Toggle availability"
          >
            <span className="avail-toggle__dot" />
            {isAvailable ? "Available" : "Offline"}
          </button>
 
          <div className="dd-notif" ref={notifRef}>
            <button
              className="icon-btn"
              onClick={() => setShowNotifications((v) => !v)}
              aria-label="Notifications"
            >
              <FiBell />
              {unreadNotifications > 0 && <span className="icon-btn__dot" />}
            </button>
            {showNotifications && (
              <div className="dd-notif__dropdown">
                <div className="dd-notif__header">Notifications</div>
                <ul className="dd-notif__list">
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.id} className={`dd-notif__item dd-notif__item--${n.tone}`}>
                      <span className="dd-notif__text">{n.text}</span>
                      <span className="dd-notif__time">{n.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
 
          <div className="dd-profile">
            <span className="dd-profile__avatar">{DOCTOR.initials}</span>
            <span className="dd-profile__text">
              <span className="dd-profile__name">{DOCTOR.name}</span>
              <span className="dd-profile__role">{DOCTOR.specialization}</span>
            </span>
          </div>
 
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </header>
        </>
    );
}

export default DoctorNavbar;