package com.hms.hmsbackend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "consultations")
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "appointment_id",
            nullable = false,
            unique = true
    )
    private Appointment appointment;

    @Column(length = 2000)
    private String diagnosis;

    @Column(length = 4000)
    private String notes;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @OneToMany(
            mappedBy = "consultation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ConsultationTest> tests = new ArrayList<>();

    @OneToMany(
            mappedBy = "consultation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Prescription> prescriptions = new ArrayList<>();

    public void addTest(ConsultationTest test) {
        tests.add(test);
        test.setConsultation(this);
    }

    public void clearTests() {
        tests.clear();
    }

    public void addPrescription(Prescription prescription) {
        prescriptions.add(prescription);
        prescription.setConsultation(this);
    }

    public void clearPrescriptions() {
        prescriptions.clear();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
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

    public List<ConsultationTest> getTests() {
        return tests;
    }

    public void setTests(List<ConsultationTest> tests) {
        this.tests = tests;
    }

    public List<Prescription> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<Prescription> prescriptions) {
        this.prescriptions = prescriptions;
    }
}
