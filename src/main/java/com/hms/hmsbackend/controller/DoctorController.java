package com.hms.hmsbackend.controller;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.AppointmentStatus;
import com.hms.hmsbackend.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    AppointmentService appointmentService;

    public DoctorController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/{doctorId}/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId){
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctorId));
    }

    @PutMapping("/{doctorId}/appointments/{appointmentId}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long doctorId,
                                                     @PathVariable Long appointmentId,
                                                     @RequestParam("status") AppointmentStatus appointmentStatus){
        try{
            Appointment appointment = appointmentService.updateDoctorAppointmentStatus(doctorId, appointmentId, appointmentStatus);
            return ResponseEntity.ok(appointment);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
