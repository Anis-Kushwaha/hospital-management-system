import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiActivity,
  FiCpu,
  FiDroplet,
  FiImage,
  FiLayers,
  FiRadio,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import "../DoctorDashboard.css";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import WelcomeSection from "../components/Doctor/WelcomeSection";
import StatsGrid from "../components/Doctor/StatsGrid";
import EmergencySection from "../components/Doctor/EmergencySection";
import PatientQueue from "../components/Doctor/PatientQueue";
import SidePanel from "../components/Doctor/SidePanel";
import PatientDrawer from "../components/Doctor/PatientDrawer";
import Toast from "../components/Doctor/Toast";

// Frontend configuration. These are not patient/doctor records.
const AVAILABLE_TESTS = [
  { id: "blood", label: "Blood Test", icon: FiDroplet },
  { id: "xray", label: "X-Ray", icon: FiImage },
  { id: "mri", label: "MRI", icon: FiCpu },
  { id: "ct", label: "CT Scan", icon: FiLayers },
  { id: "ecg", label: "ECG", icon: FiActivity },
  { id: "ultrasound", label: "Ultrasound", icon: FiRadio },
];

const DEFAULT_CONSULTATION = {
  diagnosis: "",
  notes: "",
  tests: [],
  prescriptions: [],
  stage: "Pending",
};

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function VitalLine({ className = "" }) {
  return (
    <svg
      className={`vital-line ${className}`}
      viewBox="0 0 240 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="vital-line__path"
        d="M0 20 L50 20 L62 20 L70 4 L80 36 L90 12 L98 20 L112 20 L120 20 L128 8 L136 32 L144 20 L240 20"
        fill="none"
      />
    </svg>
  );
}

function PriorityBadge({ priority }) {
  if (!priority) {
    return <span className="badge badge--normal">Not set</span>;
  }

  const normalizedPriority = String(priority)
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`badge badge--${normalizedPriority}`}>{priority}</span>
  );
}

function StageTag({ stage }) {
  if (!stage || stage === "Pending") return null;

  return (
    <span
      className={`stage-tag stage-tag--${stage
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {stage}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon">
        <Icon />
      </div>

      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__sub">{sub}</span>
      </div>
    </div>
  );
}

function DoctorDashboard() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real appointments will be loaded from the backend in the next step.
  const [patients, setPatients] = useState([]);

  // Keep empty until the notification backend is implemented.
  const [notifications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [consultationData, setConsultationData] = useState({});
  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    duration: "",
    instructions: "",
  });
  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);
  const notifRef = useRef(null);

  // Load the doctor returned by the login API.
  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");

    if (!storedDoctor) {
      navigate("/");
      return;
    }

    try {
      const parsedDoctor = JSON.parse(storedDoctor);

      if (!parsedDoctor?.id || !parsedDoctor?.name) {
        throw new Error("Invalid doctor information");
      }

      setDoctor(parsedDoctor);
    } catch (error) {
      console.error("Invalid doctor data:", error);
      localStorage.removeItem("doctor");
      navigate("/");
    }
  }, [navigate]);

  // Close notifications when the user clicks outside the dropdown.
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear pending toast timer when the dashboard unmounts.
  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const selectedPatient = useMemo(() => {
    return patients.find((patient) => patient.token === selectedToken) || null;
  }, [patients, selectedToken]);

  const currentConsultation = selectedToken
    ? consultationData[selectedToken] || DEFAULT_CONSULTATION
    : DEFAULT_CONSULTATION;

  function updateConsultation(token, patch) {
    setConsultationData((previous) => ({
      ...previous,
      [token]: {
        ...(previous[token] || DEFAULT_CONSULTATION),
        ...patch,
      },
    }));
  }

  function setPatientStatus(token, status) {
    setPatients((previous) =>
      previous.map((patient) =>
        patient.token === token ? { ...patient, status } : patient,
      ),
    );
  }

  function openPatient(token, andStart) {
    setSelectedToken(token);

    if (andStart) {
      updateConsultation(token, { stage: "In Consultation" });
    }
  }

  function closeDrawer() {
    setSelectedToken(null);
  }

  function toggleTest(testLabel) {
    if (!selectedToken) return;

    const exists = currentConsultation.tests.includes(testLabel);

    const nextTests = exists
      ? currentConsultation.tests.filter((test) => test !== testLabel)
      : [...currentConsultation.tests, testLabel];

    updateConsultation(selectedToken, { tests: nextTests });
  }

  function addPrescription() {
    if (!selectedToken) return;

    if (!medForm.name.trim() || !medForm.dosage.trim()) {
      showToast("Please add at least a medicine name and dosage.");
      return;
    }

    const newPrescription = {
      id: `rx-${Date.now()}`,
      ...medForm,
    };

    updateConsultation(selectedToken, {
      prescriptions: [...currentConsultation.prescriptions, newPrescription],
    });

    setMedForm({
      name: "",
      dosage: "",
      duration: "",
      instructions: "",
    });
  }

  function removePrescription(id) {
    if (!selectedToken) return;

    updateConsultation(selectedToken, {
      prescriptions: currentConsultation.prescriptions.filter(
        (prescription) => prescription.id !== id,
      ),
    });
  }

  function setStage(stage) {
    if (!selectedToken) return;

    updateConsultation(selectedToken, { stage });

    if (stage === "Completed") {
      // This is only local UI state for now. The real status update will be
      // sent to Spring Boot when we connect the appointment API.
      setPatientStatus(selectedToken, "COMPLETED");
      showToast(
        `Consultation completed for ${selectedPatient?.name || "patient"}.`,
      );

      setTimeout(() => closeDrawer(), 500);
      return;
    }

    showToast(
      `Marked as "${stage}" for ${selectedPatient?.name || "patient"}.`,
    );
  }

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;

    const query = searchTerm.toLowerCase();

    return patients.filter((patient) => {
      const name = patient.name?.toLowerCase() || "";
      const token = patient.token?.toLowerCase() || "";
      const department = patient.department?.toLowerCase() || "";
      const category = patient.category?.toLowerCase() || "";

      return (
        name.includes(query) ||
        token.includes(query) ||
        department.includes(query) ||
        category.includes(query)
      );
    });
  }, [patients, searchTerm]);

  const todayDate = getLocalDateString();

  const todayPatients = useMemo(() => {
    return patients.filter((patient) => patient.date === todayDate);
  }, [patients, todayDate]);

  const todaySchedule = useMemo(() => {
    return todayPatients.map((appointment) => ({
      time: appointment.slot || "—",
      patient: appointment.name || "Unknown patient",
      type: appointment.category || appointment.department || "Appointment",
    }));
  }, [todayPatients]);

  // No emergency records are invented. This will start working automatically
  // if a real priority field is added to appointment/patient data later.
  const emergencyPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        String(patient.priority || "").toUpperCase() === "EMERGENCY" &&
        normalizeStatus(patient.status) !== "COMPLETED",
    );
  }, [patients]);

  const totalToday = todayPatients.length;

  const waitingCount = todayPatients.filter((patient) => {
    const status = normalizeStatus(patient.status);

    return status === "WAITING" || status === "DOCTOR_ASSIGNED";
  }).length;

  const completedCount = todayPatients.filter(
    (patient) => normalizeStatus(patient.status) === "COMPLETED",
  ).length;

  const emergencyCount = emergencyPatients.length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const unreadNotifications = notifications.length;

  const doctorInitials = doctor?.name
    ? doctor.name
        .replace(/^Dr\.?\s*/i, "")
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  const doctorProfile = doctor
    ? {
        ...doctor,
        initials: doctorInitials,
      }
    : null;

  if (!doctorProfile) {
    return null;
  }

  return (
    <div className="dd-root">
      <DoctorNavbar
        VitalLine={VitalLine}
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
        unreadNotifications={unreadNotifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifRef={notifRef}
        DOCTOR={doctorProfile}
        NOTIFICATIONS={notifications}
      />

      <main className="dd-main">
        <WelcomeSection
          todayLabel={todayLabel}
          DOCTOR={doctorProfile}
          greeting={greeting}
          isAvailable={isAvailable}
          VitalLine={VitalLine}
        />

        <StatsGrid
          totalToday={totalToday}
          waitingCount={waitingCount}
          completedCount={completedCount}
          emergencyCount={emergencyCount}
          StatCard={StatCard}
        />

        <EmergencySection
          emergencyPatients={emergencyPatients}
          openPatient={openPatient}
        />

        <div className="content-grid">
          <PatientQueue
            searchTerm={searchTerm}
            filteredPatients={filteredPatients}
            PriorityBadge={PriorityBadge}
            openPatient={openPatient}
            setSearchTerm={setSearchTerm}
          />

          <SidePanel TODAY_SCHEDULE={todaySchedule} />
        </div>
      </main>

      <PatientDrawer
        selectedPatient={selectedPatient}
        closeDrawer={closeDrawer}
        currentConsultation={currentConsultation}
        AVAILABLE_TESTS={AVAILABLE_TESTS}
        medForm={medForm}
        setMedForm={setMedForm}
        toggleTest={toggleTest}
        addPrescription={addPrescription}
        updateConsultation={updateConsultation}
        setStage={setStage}
        selectedToken={selectedToken}
        removePrescription={removePrescription}
        StageTag={StageTag}
        PriorityBadge={PriorityBadge}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default DoctorDashboard;
