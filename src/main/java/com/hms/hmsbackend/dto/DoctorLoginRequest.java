package com.hms.hmsbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class DoctorLoginRequest {

    @NotBlank(message = "Email is required")
    @Email(
            regexp = "^[a-zA-Z0-9._%+-]+@medicare\\.hms$",
            message = "Email Does Not Belongs to Official domain Please Use Your Official Email"
    )
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    public DoctorLoginRequest() {

    }

    public DoctorLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
