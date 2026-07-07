import {FiUsers, FiClock, FiCheckCircle, FiAlertTriangle} from "react-icons/fi";

function StatsGrid({totalToday, waitingCount, completedCount, emergencyCount, StatCard}){
    return(
        <>
        <section className="stats-grid">
          <StatCard icon={FiUsers} label="Total Patients Today" value={totalToday} sub="Assigned via auto-triage" tone="primary" />
          <a href="#patient-queue" ><StatCard icon={FiClock} label="Patients Waiting" value={waitingCount} sub="Currently in queue" tone="warning" /></a>
          <StatCard icon={FiCheckCircle} label="Consultations Completed" value={completedCount} sub={`Out of ${totalToday} total`} tone="success" />
          <StatCard icon={FiAlertTriangle} label="Emergency Cases" value={emergencyCount} sub="Needs immediate attention" tone="danger" />
        </section>
        </>
    );
}

export default StatsGrid;