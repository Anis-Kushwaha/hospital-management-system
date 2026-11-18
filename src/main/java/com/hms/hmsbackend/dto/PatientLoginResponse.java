package com.hms.hmsbackend.dto;

import java.time.LocalDateTime;

public class PatientLoginResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean enabled;
    private LocalDateTime accessExpiresAt;

    public PatientLoginResponse(Long id, String name, String email, String phone, boolean enabled, LocalDateTime accessExpiresAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.enabled = enabled;
        this.accessExpiresAt = accessExpiresAt;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getAccessExpiresAt() {
        return accessExpiresAt;
    }

    public void setAccessExpiresAt(LocalDateTime accessExpiresAt) {
        this.accessExpiresAt = accessExpiresAt;
    }
}
