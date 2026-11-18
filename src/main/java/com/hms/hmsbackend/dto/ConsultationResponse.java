package com.hms.hmsbackend.dto;

import com.hms.hmsbackend.entity.Consultation;

import java.time.LocalDateTime;
import java.util.List;

public class ConsultationResponse {

    private Long consultationId;
    private Long appointmentId;
    private String diagnosis;
    private String notes;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private List<String> tests;
    private List<PrescriptionResponse> prescriptions;

    public ConsultationResponse(Consultation consultation) {
        this.consultationId = consultation.getId();
        this.appointmentId = consultation.getAppointment().getId();
        this.diagnosis = consultation.getDiagnosis();
        this.notes = consultation.getNotes();
        this.startedAt = consultation.getStartedAt();
        this.completedAt = consultation.getCompletedAt();
        this.tests = consultation.getTests().stream().map(test -> test.getTestName()).toList();
        this.prescriptions = consultation.getPrescriptions().stream().map(PrescriptionResponse::new).toList();
    }

    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<String> getTests() {
        return tests;
    }

    public void setTests(List<String> tests) {
        this.tests = tests;
    }

    public List<PrescriptionResponse> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<PrescriptionResponse> prescriptions) {
        this.prescriptions = prescriptions;
    }
}
