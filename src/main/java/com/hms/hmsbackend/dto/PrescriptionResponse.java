package com.hms.hmsbackend.dto;

import com.hms.hmsbackend.entity.Prescription;

public class PrescriptionResponse {

    private Long id;
    private String medicineName;
    private String dosage;
    private String duration;
    private String instructions;

    public PrescriptionResponse(Prescription prescription) {
        this.id = prescription.getId();
        this.medicineName = prescription.getMedicineName();
        this.dosage = prescription.getDosage();
        this.duration = prescription.getDuration();
        this.instructions = prescription.getInstructions();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
