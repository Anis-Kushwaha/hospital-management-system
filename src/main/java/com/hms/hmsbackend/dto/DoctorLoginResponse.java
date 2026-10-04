package com.hms.hmsbackend.dto;

public class DoctorLoginResponse {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String specialization;

    public DoctorLoginResponse() {
    }

    public DoctorLoginResponse(Long id, String name, String email, String department, String specialization) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.specialization = specialization;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}
