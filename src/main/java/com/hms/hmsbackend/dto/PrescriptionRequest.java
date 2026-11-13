package com.hms.hmsbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PrescriptionRequest {

    @NotBlank(message = "Medicine name is required")
    @Size(max = 150)
    private String medicineName;

    @NotBlank(message = "Dosage is required")
    @Size(max = 100)
    private String dosage;

    @Size(max = 100)
    private String duration;

    @Size(max = 1000)
    private String instructions;

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
