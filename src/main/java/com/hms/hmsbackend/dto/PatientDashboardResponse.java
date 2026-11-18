package com.hms.hmsbackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PatientDashboardResponse {

    public PatientProfile patient;
    public List<AppointmentDetails> appointments;
    public AppointmentDetails latestAppointment;

    public static class PatientProfile {
        public Long id;
        public String name;
        public String email;
        public String phone;
        public LocalDateTime createdAt;
        public LocalDateTime accessExpiresAt;
    }

    public static class AppointmentDetails {
        public Long id;
        public String token;
        public String date;
        public String slot;
        public String department;
        public String reason;
        public String status;

        public DoctorDetails doctor;
        public QueueDetails queue;
        public ConsultationDetails consultation;
    }

    public static class DoctorDetails {
        public Long id;
        public String name;
        public String email;
        public String department;
        public String specialization;
        public String phone;
    }

    public static class QueueDetails {
        public Integer queuePosition;
        public Integer patientsAhead;
        public Integer totalPatients;
        public String currentlyServingToken;
        public boolean currentlyServing;
        public Integer estimatedWaitMinutes;
    }

    public static class ConsultationDetails {
        public Long id;
        public String diagnosis;
        public String notes;
        public LocalDateTime startedAt;
        public LocalDateTime completedAt;
        public List<TestDetails> tests;
        public List<PrescriptionDetails> prescriptions;
    }

    public static class TestDetails {
        public Long id;
        public String testName;
    }

    public static class PrescriptionDetails {
        public Long id;
        public String medicineName;
        public String dosage;
        public String duration;
        public String instructions;
    }
}
