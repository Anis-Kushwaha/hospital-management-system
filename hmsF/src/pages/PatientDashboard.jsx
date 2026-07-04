import React from "react";
import '../PatientDashboard.css';
import PatientHeroSection from "../components/Pateint/PatientHeroSection";
import TokenJourneyCard from "../components/Pateint/TokenJourneyCard";
import PatientAppointmentCard from "../components/Pateint/PatientAppointmentCard";
import PrescriptionCard from "../components/Pateint/PrescriptionCard";
import PaymentCard from "../components/Pateint/PaymentCard";
import DoctorCard from "../components/Pateint/DoctorCard";
import HealthInsightsCard from "../components/Pateint/HealthInsightsCard";
import PateintAI from "../components/Pateint/PatientAI";

// ─── Dummy Data ──────────────────────────────────────────────────────────────
const PATIENT = {
  name: 'Anis',
  id: 'P10245',
  bloodGroup: 'O+',
  age: 20,
  healthStatus: 'Good',
};
 
const APPOINTMENT = {
  day: '27',
  month: 'JUNE',
  date: '27 June 2025',
  time: '10:30 AM',
  department: 'Cardiology',
  doctor: 'Dr. Priya Sharma',
  hospital: 'City Heart Hospital',
  room: 'Room 204, 2nd Floor',
  status: 'Confirmed',
};
 
const TOKEN = {
  mine: 123,
  serving: 95,
  estimatedWait: 20,
};
 
const DOCTOR = {
  name: 'Dr. Priya Sharma',
  initials: 'PS',
  specialty: 'Senior Cardiologist',
  experience: 12,
  rating: 4.9,
  reviews: 234,
  available: true,
  nextSlot: '10:30 AM Today',
};
 
const PRESCRIPTIONS = [
  {
    id: 1,
    date: '20 Jun 2025',
    name: 'Atorvastatin 40mg',
    type: 'Tablet · Daily',
    doctor: 'Dr. Sharma',
    status: 'Active',
  },
  {
    id: 2,
    date: '10 May 2025',
    name: 'Metoprolol 25mg',
    type: 'Tablet · Twice Daily',
    doctor: 'Dr. Sharma',
    status: 'Active',
  },
  {
    id: 3,
    date: '15 Mar 2025',
    name: 'Aspirin 75mg',
    type: 'Tablet · Daily',
    doctor: 'Dr. R. Mehta',
    status: 'Completed',
  },
];
 
const PAYMENT = {
  outstanding: 500,
  invoiceId: 'INV-2025-0612',
  dueDate: '30 Jun 2025',
  items: [
    { desc: 'Consultation Fee', amount: 300 },
    { desc: 'ECG Test', amount: 200 },
  ],
};
 
const HEALTH_TIPS = [
  {
    emoji: '💊',
    type: 'reminder',
    title: 'Medication Reminder',
    desc: 'Atorvastatin — take 1 tablet tonight with dinner',
  },
  {
    emoji: '💧',
    type: 'hydration',
    title: 'Hydration Goal',
    desc: 'At 60% of your daily water intake. Keep going!',
    progress: 60,
  },
  {
    emoji: '🫀',
    type: 'tip',
    title: 'Heart Health Tip',
    desc: '30 minutes of walking daily reduces cardiac risk by 35%',
  },
];

function PatientDashboard(){
    return(
        <>
            <div className="pd-root">
      <PatientHeroSection PATIENT = {PATIENT} APPOINTMENT = {APPOINTMENT} />
 
      <div className="pd-layout">
        {/* Main Content */}
        <main className="pd-main">
          <TokenJourneyCard APPOINTMENT = {APPOINTMENT} TOKEN = {TOKEN} />
          <PatientAppointmentCard APPOINTMENT = {APPOINTMENT} />
          <div className="pd-bottom-row">
            <PrescriptionCard PRESCRIPTIONS = {PRESCRIPTIONS} />
            <PaymentCard PAYMENT = {PAYMENT} />
          </div>
        </main>
 
        {/* Sidebar */}
        <aside className="pd-sidebar">
          <DoctorCard DOCTOR = {DOCTOR} />
          <HealthInsightsCard HEALTH_TIPS = {HEALTH_TIPS} />
          <PateintAI/>
          <div>if any test is to do then it will appear here</div>
        </aside>
      </div>
    </div>
        </>
    );
}

export default PatientDashboard;