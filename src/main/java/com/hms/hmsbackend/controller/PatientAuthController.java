package com.hms.hmsbackend.controller;

import com.hms.hmsbackend.dto.PatientLoginRequest;
import com.hms.hmsbackend.dto.PatientLoginResponse;
import com.hms.hmsbackend.service.PatientAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientAuthController {

    private final PatientAuthService patientAuthService;

    public PatientAuthController(PatientAuthService patientAuthService) {
        this.patientAuthService = patientAuthService;
    }


    @PostMapping("/login")
    public ResponseEntity<PatientLoginResponse> login(
            @Valid @RequestBody PatientLoginRequest request) {

        return ResponseEntity.ok(patientAuthService.login(request));
    }
}
