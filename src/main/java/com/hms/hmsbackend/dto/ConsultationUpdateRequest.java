package com.hms.hmsbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ConsultationUpdateRequest {

    @NotBlank(message = "Diagnosis is required")
    @Size(max = 2000, message = "Diagnosis is too long")
    private String diagnosis;

    @Size(max = 4000, message = "Notes are too long")
    private String notes;

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
}
