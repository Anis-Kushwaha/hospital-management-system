package com.hms.hmsbackend.controller;

import com.hms.hmsbackend.dto.ConsultationResponse;
import com.hms.hmsbackend.dto.ConsultationUpdateRequest;
import com.hms.hmsbackend.entity.Consultation;
import com.hms.hmsbackend.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class ConsultationController {
    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PutMapping("/{doctorId}/appointments/{appointmentId}/consultation")
    public ResponseEntity<ConsultationResponse> updateConsultation(
            @PathVariable Long doctorId,
            @PathVariable Long appointmentId,
            @Valid @RequestBody ConsultationUpdateRequest request
            ) {

        Consultation consultation = consultationService.updateConsultation(
                doctorId,
                appointmentId,
                request
        );
        return ResponseEntity.ok(
                new ConsultationResponse(consultation)
        );
    }

    @GetMapping("/{doctorId}/appointments/{appointmentId}/consultation")
    public ResponseEntity<ConsultationResponse> getConsultation(
            @PathVariable Long doctorId,
            @PathVariable Long appointmentId
    ) {
        Consultation consultation = consultationService.getDoctorConsultation(doctorId,appointmentId);

        return ResponseEntity.ok(
                new ConsultationResponse(consultation)
        );
    }
}
