package com.hms.hmsbackend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class ConsultationUpdateRequest {

    @NotBlank(message = "Diagnosis is required")
    @Size(max = 2000, message = "Diagnosis is too long")
    private String diagnosis;

    @Size(max = 4000, message = "Notes are too long")
    private String notes;

    @Size(max = 4, message = "Too many tests selected")
    private List<@NotBlank(message = "Test name cannot be blank")@Size(max = 100) String> tests = new ArrayList<>();

    @Size(max = 50, message = "Too many prescriptions")
    @Valid
    private List<PrescriptionRequest> prescriptions = new ArrayList<>();

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

    public List<String> getTests() {
        return tests;
    }

    public void setTests(List<String> tests) {
        this.tests = tests;
    }

    public List<PrescriptionRequest> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<PrescriptionRequest> prescriptions) {
        this.prescriptions = prescriptions;
    }
}
