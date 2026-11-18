package com.hms.hmsbackend.service;

import com.hms.hmsbackend.dto.PatientLoginRequest;
import com.hms.hmsbackend.dto.PatientLoginResponse;
import com.hms.hmsbackend.entity.Patient;
import com.hms.hmsbackend.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class PatientAuthService {

    private final PatientRepository patientRepository;

    public PatientAuthService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public PatientLoginResponse login(PatientLoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!patient.isEnabled()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Patient account is disabled"
            );
        }

        if (patient.getAccessExpiresAt() != null
                && !patient.getAccessExpiresAt().isAfter(LocalDateTime.now())) {

            patient.setEnabled(false);
            patientRepository.save(patient);

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Patient access has expired"
            );
        }

        // Plain-text comparison for the current prototype.
        if (!patient.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return new PatientLoginResponse(
                patient.getId(),
                patient.getName(),
                patient.getEmail(),
                patient.getPhone(),
                patient.isEnabled(),
                patient.getAccessExpiresAt()
        );
    }
}
