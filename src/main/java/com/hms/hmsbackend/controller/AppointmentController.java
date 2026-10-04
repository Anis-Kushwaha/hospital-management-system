package com.hms.hmsbackend.controller;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.AppointmentStatus;
import com.hms.hmsbackend.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public Appointment CreateAppointment(@RequestBody Appointment appointment) {
        return appointmentService.saveAppointment(appointment);
    }

    @GetMapping("/admin")
    public List<Appointment> getAppointments() {
        return appointmentService.getAllAppointments();
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        try {
            Appointment updated =
                    appointmentService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/admin/{appointmentId}/assign-doctor/{doctorId}")
    public ResponseEntity<?> assignDoctor(@PathVariable Long appointmentId, @PathVariable Long doctorId) {
        try {
            Appointment updatedAppointment = appointmentService.assignDoctor(appointmentId, doctorId);
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/admin/{appointmentId}/remove-doctor")
    public ResponseEntity<?> removeDoctor(@PathVariable Long appointmentId) {
        try {
            Appointment updatedAppointment = appointmentService.removeDoctor(appointmentId);
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
