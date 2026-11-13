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
import SidePanel from "../components/Doctor/SidePanel";
import PatientDrawer from "../components/Doctor/PatientDrawer";
import Toast from "../components/Doctor/Toast";
import AssignedAppointments from "../components/Doctor/AssignedAppointments";

const API_URL = "http://localhost:8080/api";

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

  const [patients, setPatients] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [notifications] = useState([]);

  const [selectedToken, setSelectedToken] = useState(null);
  const [consultationData, setConsultationData] = useState({});

  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationSaving, setConsultationSaving] = useState(false);

  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    duration: "",
    instructions: "",
  });

  const [toast, setToast] = useState(null);

  const toastTimer = useRef(null);
  const notifRef = useRef(null);

  // Load logged-in doctor.
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

  function showToast(message) {
    setToast(message);

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 2600);
  }

  // Fetch appointments assigned to the logged-in doctor.
  useEffect(() => {
    if (!doctor?.id) return;

    let cancelled = false;

    async function fetchAssignedAppointments() {
      try {
        setAppointmentsLoading(true);

        const response = await fetch(
          `${API_URL}/doctors/${doctor.id}/appointments`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned appointments");
        }

        const data = await response.json();

        if (!cancelled) {
          setPatients(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Assigned appointment fetch error:", error);

        if (!cancelled) {
          setPatients([]);
          showToast("Unable to load assigned appointments.");
        }
      } finally {
        if (!cancelled) {
          setAppointmentsLoading(false);
        }
      }
    }

    fetchAssignedAppointments();

    return () => {
      cancelled = true;
    };
  }, [doctor?.id]);

  // Update appointment status through the backend.
  async function handleAppointmentStatusChange(appointmentId, newStatus) {
    if (!doctor?.id) {
      showToast("Doctor information is not available.");
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/doctors/${doctor.id}/appointments/${appointmentId}/status?status=${newStatus}`,
        { method: "PUT" },
      );

      if (!response.ok) {
        const message = await response.text();
        showToast(message || "Unable to update appointment status.");
        return null;
      }

      const updatedAppointment = await response.json();

      setPatients((previous) =>
        previous.map((appointment) =>
          appointment.id === appointmentId ? updatedAppointment : appointment,
        ),
      );

      if (newStatus === "IN_CONSULTATION") {
        showToast("Consultation started.");
      } else if (newStatus === "COMPLETED") {
        showToast("Consultation completed.");
      }

      return updatedAppointment;
    } catch (error) {
      console.error("Appointment status update error:", error);
      showToast("Unable to connect to server.");
      return null;
    }
  }

  // Load the saved consultation from the backend.

  // Load the saved consultation from the backend.
  async function fetchConsultation(patient) {
    if (!doctor?.id || !patient?.id) return false;

    setConsultationLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/doctors/${doctor.id}/appointments/${patient.id}/consultation`,
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to load consultation.");
      }

      const data = await response.json();

      const appointmentStatus = normalizeStatus(patient.status);

      const consultationStage =
        appointmentStatus === "COMPLETED" ? "Completed" : "In Consultation";

      setConsultationData((previous) => ({
        ...previous,
        [patient.token]: {
          ...(previous[patient.token] || DEFAULT_CONSULTATION),
          diagnosis: data.diagnosis || "",
          notes: data.notes || "",
          stage: consultationStage,
          consultationId: data.consultationId,
          startedAt: data.startedAt,
          completedAt: data.completedAt,
        },
      }));

      return true;
    } catch (error) {
      console.error("Consultation fetch error:", error);
      showToast(error.message || "Unable to load consultation.");
      return false;
    } finally {
      setConsultationLoading(false);
    }
  }

  // Save diagnosis and notes to the backend.
  async function handleSaveConsultation() {
    if (!selectedPatient?.id || !doctor?.id) {
      showToast("Appointment information is missing.");
      return false;
    }

    const current = consultationData[selectedToken] || DEFAULT_CONSULTATION;

    if (!current.diagnosis.trim()) {
      showToast("Please enter a diagnosis.");
      return false;
    }

    if (normalizeStatus(selectedPatient.status) !== "IN_CONSULTATION") {
      showToast("Start the consultation before saving.");
      return false;
    }

    setConsultationSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/doctors/${doctor.id}/appointments/${selectedPatient.id}/consultation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            diagnosis: current.diagnosis.trim(),
            notes: current.notes.trim(),
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to save consultation.");
      }

      const data = await response.json();

      setConsultationData((previous) => ({
        ...previous,
        [selectedToken]: {
          ...(previous[selectedToken] || DEFAULT_CONSULTATION),
          diagnosis: data.diagnosis || "",
          notes: data.notes || "",
          consultationId: data.consultationId,
          startedAt: data.startedAt,
          completedAt: data.completedAt,
          stage: "In Consultation",
        },
      }));

      showToast("Diagnosis and notes saved successfully.");
      return true;
    } catch (error) {
      console.error("Consultation save error:", error);
      showToast(error.message || "Unable to save consultation.");
      return false;
    } finally {
      setConsultationSaving(false);
    }
  }

  // Close notification dropdown when clicking outside.
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

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

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

  // Open an appointment and optionally start consultation.
  async function openPatient(token, andStart = false) {
    const patient = patients.find((item) => item.token === token);

    if (!patient) {
      showToast("Appointment not found.");
      return;
    }

    setSelectedToken(token);

    let status = normalizeStatus(patient.status);

    if (andStart && status === "DOCTOR_ASSIGNED") {
      const updated = await handleAppointmentStatusChange(
        patient.id,
        "IN_CONSULTATION",
      );

      if (!updated) {
        setSelectedToken(null);
        return;
      }

      status = normalizeStatus(updated.status);
    }

    if (status === "IN_CONSULTATION" || status === "COMPLETED") {
      await fetchConsultation(patient);
    } else if (status !== "DOCTOR_ASSIGNED") {
      setSelectedToken(null);
      showToast("This appointment cannot be opened.");
    }
  }

  function closeDrawer() {
    setSelectedToken(null);
    setMedForm({
      name: "",
      dosage: "",
      duration: "",
      instructions: "",
    });
  }

  function toggleTest(testLabel) {
    if (!selectedToken) return;

    const exists = currentConsultation.tests.includes(testLabel);

    const nextTests = exists
      ? currentConsultation.tests.filter((test) => test !== testLabel)
      : [...currentConsultation.tests, testLabel];

    updateConsultation(selectedToken, {
      tests: nextTests,
    });
  }

  function addPrescription() {
    if (!selectedToken) return;

    if (!medForm.name.trim() || !medForm.dosage.trim()) {
      showToast("Please add a medicine name and dosage.");
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

  // Save diagnosis before completing the appointment.
  async function setStage(stage) {
    if (!selectedToken || !selectedPatient) return;

    if (stage === "Completed") {
      if (normalizeStatus(selectedPatient.status) !== "IN_CONSULTATION") {
        showToast("Only an active consultation can be completed.");
        return;
      }

      const saved = await handleSaveConsultation();

      if (!saved) return;

      const updated = await handleAppointmentStatusChange(
        selectedPatient.id,
        "COMPLETED",
      );

      if (!updated) return;

      updateConsultation(selectedToken, {
        stage: "Completed",
      });

      setTimeout(closeDrawer, 500);
      return;
    }

    updateConsultation(selectedToken, { stage });

    showToast(`Marked as "${stage}" for ${selectedPatient.name}.`);
  }

  const todayDate = getLocalDateString();

  const todayAppointments = useMemo(
    () => patients.filter((appointment) => appointment.date === todayDate),
    [patients, todayDate],
  );

  const todaySchedule = useMemo(
    () =>
      todayAppointments.map((appointment) => ({
        time: appointment.slot || "—",
        patient: appointment.name || "Unknown patient",
        type: appointment.department || "Appointment",
      })),
    [todayAppointments],
  );

  const emergencyPatients = useMemo(
    () =>
      patients.filter(
        (patient) =>
          String(patient.priority || "").toUpperCase() === "EMERGENCY" &&
          normalizeStatus(patient.status) !== "COMPLETED",
      ),
    [patients],
  );

  const totalToday = todayAppointments.length;

  const waitingCount = todayAppointments.filter(
    (appointment) => normalizeStatus(appointment.status) === "DOCTOR_ASSIGNED",
  ).length;

  const completedCount = todayAppointments.filter(
    (appointment) => normalizeStatus(appointment.status) === "COMPLETED",
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

  const doctorProfile = doctor ? { ...doctor, initials: doctorInitials } : null;

  if (!doctorProfile) return null;

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
          <AssignedAppointments
            appointments={patients}
            loading={appointmentsLoading}
            onStatusChange={handleAppointmentStatusChange}
            onOpenPatient={openPatient}
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
        onSaveConsultation={handleSaveConsultation}
        consultationLoading={consultationLoading}
        consultationSaving={consultationSaving}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default DoctorDashboard;
