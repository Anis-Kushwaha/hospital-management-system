import React, { useState, useMemo, useEffect, useRef } from "react";
import {FiDroplet, FiImage, FiCpu, FiLayers, FiActivity, FiRadio} from "react-icons/fi";
import "../DoctorDashboard.css";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import WelcomeSection from "../components/Doctor/WelcomeSection";
import StatsGrid from "../components/Doctor/StatsGrid";
import EmergencySection from "../components/Doctor/EmergencySection";
import PatientQueue from "../components/Doctor/PatientQueue";
import SidePanel from "../components/Doctor/SidePanel";
import PatientDrawer from "../components/Doctor/PatientDrawer";
import Toast from "../components/Doctor/Toast";
 
/*  Dummy data                                                         */
const DOCTOR = {
  name: "Dr. Anis Kushwaha",
  specialization: "Bhagwan ji",
  qualifications: "MBBS, SDE-1 ",
  experience: "12 yrs experience",
  id: "DOC-2291",
  initials: "AS",
};
 
const INITIAL_PATIENTS = [
  {
    token: "T-020",
    name: "Vikram Desai",
    age: 72,
    gender: "Male",
    contact: "+91 90000 11223",
    category: "Cardiac - Emergency Chest Pain",
    time: "08:50 AM",
    priority: "Emergency",
    status: "Waiting",
    symptoms: "Crushing chest pain radiating to the left arm, breathlessness, cold sweat.",
    history: "Prior myocardial infarction (2019), Type 2 Diabetes, on daily aspirin.",
    reports: ["ECG_Emergency_04Jul.pdf"],
  },
  {
    token: "T-014",
    name: "Rajesh Verma",
    age: 54,
    gender: "Male",
    contact: "+91 98765 43210",
    category: "Cardiac - Chest Pain",
    time: "09:30 AM",
    priority: "Emergency",
    status: "Waiting",
    symptoms: "Severe chest pain, shortness of breath, sweating since this morning.",
    history: "Hypertension (8 yrs), Type 2 Diabetes, angioplasty in 2022.",
    reports: ["ECG_Report_04Jul.pdf", "Blood_Panel_03Jul.pdf"],
  },
  {
    token: "T-015",
    name: "Sunita Rao",
    age: 61,
    gender: "Female",
    contact: "+91 91234 56780",
    category: "Cardiac - Arrhythmia",
    time: "09:45 AM",
    priority: "High",
    status: "Waiting",
    symptoms: "Palpitations and dizziness, worse on standing up quickly.",
    history: "Atrial fibrillation diagnosed in 2021, on anticoagulants.",
    reports: ["Holter_Monitor_June.pdf"],
  },
  {
    token: "T-018",
    name: "Arjun Singh",
    age: 67,
    gender: "Male",
    contact: "+91 99887 66554",
    category: "Cardiac - Post-Surgery Follow-up",
    time: "10:30 AM",
    priority: "High",
    status: "Waiting",
    symptoms: "Mild swelling in ankles, occasional fatigue post-surgery.",
    history: "CABG surgery performed 6 weeks ago, recovering well.",
    reports: ["Discharge_Summary.pdf", "Echo_Report.pdf"],
  },
  {
    token: "T-016",
    name: "Karan Mehta",
    age: 45,
    gender: "Male",
    contact: "+91 93456 12378",
    category: "Cardiac - Routine Checkup",
    time: "10:00 AM",
    priority: "Normal",
    status: "Waiting",
    symptoms: "Mild fatigue, here for a routine follow-up.",
    history: "Stable angina, well managed on current medication.",
    reports: ["Lipid_Profile_May.pdf"],
  },
  {
    token: "T-017",
    name: "Priya Nair",
    age: 38,
    gender: "Female",
    contact: "+91 90011 22334",
    category: "Cardiac - Hypertension",
    time: "10:15 AM",
    priority: "Normal",
    status: "Waiting",
    symptoms: "Occasional headaches, elevated BP readings taken at home.",
    history: "No prior cardiac history. Family history of hypertension.",
    reports: [],
  },
  {
    token: "T-019",
    name: "Meera Iyer",
    age: 29,
    gender: "Female",
    contact: "+91 98123 45677",
    category: "Cardiac - Palpitations",
    time: "10:45 AM",
    priority: "Normal",
    status: "In Consultation",
    symptoms: "Occasional palpitations during exercise, otherwise well.",
    history: "Generalised anxiety disorder, no confirmed cardiac diagnosis.",
    reports: [],
  },
  {
    token: "T-013",
    name: "Anjali Gupta",
    age: 50,
    gender: "Female",
    contact: "+91 97654 32109",
    category: "Cardiac - Routine",
    time: "09:00 AM",
    priority: "Normal",
    status: "Completed",
    symptoms: "Annual cardiac wellness review.",
    history: "No known cardiac conditions.",
    reports: ["Annual_Checkup_2026.pdf"],
  },
];
 
const TODAY_SCHEDULE = [
  { time: "11:00 AM", patient: "Ramesh Choudhary", type: "Follow-up" },
  { time: "11:30 AM", patient: "Fatima Sheikh", type: "New Consultation" },
  { time: "12:15 PM", patient: "Devendra Patil", type: "Test Review" },
  { time: "02:00 PM", patient: "Neha Kulkarni", type: "Routine Checkup" },
  { time: "02:45 PM", patient: "Suresh Bhandari", type: "Post-Op Review" },
];
 
const NOTIFICATIONS = [
  { id: 1, text: "New emergency patient assigned: Vikram Desai", time: "2 min ago", tone: "danger" },
  { id: 2, text: "Lab report uploaded for Sunita Rao", time: "18 min ago", tone: "info" },
  { id: 3, text: "Follow-up reminder: Karan Mehta at 10:00 AM", time: "32 min ago", tone: "warning" },
  { id: 4, text: "Prescription refill requested by Priya Nair", time: "1 hr ago", tone: "info" },
];
 
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

/*  Small presentational helpers                                       */
 
function VitalLine({ className = "" }) {
  return (
    <svg className={`vital-line ${className}`} viewBox="0 0 240 40" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="vital-line__path"
        d="M0 20 L50 20 L62 20 L70 4 L80 36 L90 12 L98 20 L112 20 L120 20 L128 8 L136 32 L144 20 L240 20"
        fill="none"
      />
    </svg>
  );
}
 
function PriorityBadge({ priority }) {
  return <span className={`badge badge--${priority.toLowerCase()}`}>{priority}</span>;
}
 
function StageTag({ stage }) {
  if (!stage || stage === "Pending") return null;
  return <span className={`stage-tag stage-tag--${stage.toLowerCase().replace(/\s+/g, "-")}`}>{stage}</span>;
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
 
/*  Main component                                                     */
 
function DoctorDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [consultationData, setConsultationData] = useState({});
  const [medForm, setMedForm] = useState({ name: "", dosage: "", duration: "", instructions: "" });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const notifRef = useRef(null);
 
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);
 
  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }
 
  const selectedPatient = useMemo(
    () => patients.find((p) => p.token === selectedToken) || null,
    [patients, selectedToken]
  );
 
  const currentConsultation = selectedToken
    ? consultationData[selectedToken] || DEFAULT_CONSULTATION
    : DEFAULT_CONSULTATION;
 
  function updateConsultation(token, patch) {
    setConsultationData((prev) => ({
      ...prev,
      [token]: { ...(prev[token] || DEFAULT_CONSULTATION), ...patch },
    }));
  }
 
  function setPatientStatus(token, status) {
    setPatients((prev) => prev.map((p) => (p.token === token ? { ...p, status } : p)));
  }
 
  function openPatient(token, andStart) {
    setSelectedToken(token);
    if (andStart) {
      const patient = patients.find((p) => p.token === token);
      if (patient && patient.status === "Waiting") {
        setPatientStatus(token, "In Consultation");
      }
    }
  }
 
  function closeDrawer() {
    setSelectedToken(null);
  }
 
  function toggleTest(testLabel) {
    if (!selectedToken) return;
    const exists = currentConsultation.tests.includes(testLabel);
    const nextTests = exists
      ? currentConsultation.tests.filter((t) => t !== testLabel)
      : [...currentConsultation.tests, testLabel];
    updateConsultation(selectedToken, { tests: nextTests });
  }
 
  function addPrescription() {
    if (!selectedToken) return;
    if (!medForm.name.trim() || !medForm.dosage.trim()) {
      showToast("Please add at least a medicine name and dosage.");
      return;
    }
    const newRx = { id: `rx-${Date.now()}`, ...medForm };
    updateConsultation(selectedToken, {
      prescriptions: [...currentConsultation.prescriptions, newRx],
    });
    setMedForm({ name: "", dosage: "", duration: "", instructions: "" });
  }
 
  function removePrescription(id) {
    updateConsultation(selectedToken, {
      prescriptions: currentConsultation.prescriptions.filter((rx) => rx.id !== id),
    });
  }
 
  function setStage(stage) {
    if (!selectedToken) return;
    updateConsultation(selectedToken, { stage });
    if (stage === "Completed") {
      setPatientStatus(selectedToken, "Completed");
      showToast(`Consultation completed for ${selectedPatient?.name}.`);
      setTimeout(() => closeDrawer(), 500);
    } else {
      showToast(`Marked as "${stage}" for ${selectedPatient?.name}.`);
    }
  }
 
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    const q = searchTerm.toLowerCase();
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.token.toLowerCase().includes(q)
    );
  }, [patients, searchTerm]);
 
  const emergencyPatients = useMemo(
    () => patients.filter((p) => p.priority === "Emergency" && p.status !== "Completed"),
    [patients]
  );
 
  const totalToday = patients.length;
  const waitingCount = patients.filter((p) => p.status === "Waiting").length;
  const completedCount = patients.filter((p) => p.status === "Completed").length;
  const emergencyCount = emergencyPatients.length;
 
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
 
  const unreadNotifications = NOTIFICATIONS.length;
 
  return (
    <div className="dd-root">
      {/* Navbar + */}
      <DoctorNavbar VitalLine = {VitalLine}  isAvailable={isAvailable} setIsAvailable={setIsAvailable} unreadNotifications={unreadNotifications} showNotifications={showNotifications} setShowNotifications={setShowNotifications} notifRef = {notifRef} DOCTOR = {DOCTOR} showToast = {showToast} NOTIFICATIONS = {NOTIFICATIONS} />
 
      <main className="dd-main">
        {/* Welcome section                                             */}
        <WelcomeSection todayLabel = {todayLabel} DOCTOR = {DOCTOR} greeting = {greeting} isAvailable = {isAvailable} VitalLine = {VitalLine} />

        {/* Stats */}
        <StatsGrid totalToday = {totalToday} waitingCount = {waitingCount} completedCount = {completedCount} emergencyCount = {emergencyCount} StatCard = {StatCard} />

        {/* Emergency alerts                                            */}
        <EmergencySection emergencyPatients = {emergencyPatients} openPatient = {openPatient} />
         
        {/* Content grid: queue + side panel                            */}
        <div className="content-grid">
          {/* Patient queue */}
          <PatientQueue searchTerm = {searchTerm} filteredPatients = {filteredPatients} PriorityBadge = {PriorityBadge} openPatient ={openPatient} setSearchTerm = {setSearchTerm} />
 
          {/* Side panel */}
          <SidePanel TODAY_SCHEDULE = {TODAY_SCHEDULE}  />
        </div>
      </main>
 
      {/* Patient details drawer                                      */}
      <PatientDrawer selectedPatient = {selectedPatient} closeDrawer = {closeDrawer} currentConsultation = {currentConsultation}     AVAILABLE_TESTS = {AVAILABLE_TESTS} medForm = {medForm} setMedForm={setMedForm} toggleTest = {toggleTest} addPrescription = {addPrescription} updateConsultation = {updateConsultation} setStage = {setStage} selectedToken={selectedToken} removePrescription={removePrescription} StageTag = {StageTag} PriorityBadge = {PriorityBadge} />
 
      <Toast toast = {toast} />
    </div>
  );
}
 
export default DoctorDashboard;