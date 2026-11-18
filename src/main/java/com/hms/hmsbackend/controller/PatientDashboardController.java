package com.hms.hmsbackend.controller;

import com.hms.hmsbackend.dto.PatientDashboardResponse;
import com.hms.hmsbackend.service.PatientDashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientDashboardController {

    private final PatientDashboardService patientDashboardService;

    public PatientDashboardController(PatientDashboardService patientDashboardService) {
        this.patientDashboardService = patientDashboardService;
    }

    @GetMapping("/{patientId}/dashboard")
    public PatientDashboardResponse getDashboard(
            @PathVariable Long patientId) {

        return patientDashboardService.getDashboard(patientId);
    }
}
