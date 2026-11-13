package com.hms.hmsbackend.dto;

import java.time.LocalDateTime;

public class ConsultationResponse {

    private Long consultationId;
    private Long appointmentId;
    private String diagnosis;
    private String notes;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public ConsultationResponse(
            Long consultationId, Long appointmentId, String diagnosis,
            String notes, LocalDateTime startedAt, LocalDateTime completedAt
    ) {
        this.consultationId = consultationId;
        this.appointmentId = appointmentId;
        this.diagnosis = diagnosis;
        this.notes = notes;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
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
}
