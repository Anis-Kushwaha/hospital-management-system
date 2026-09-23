package com.hms.hmsbackend.controller;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.AppointmentStatus;
import com.hms.hmsbackend.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service){
        this.service = service;
    }

    @PostMapping
    public Appointment CreateAppointment(@RequestBody Appointment appointment){
        return service.saveAppointment(appointment);
    }

    @GetMapping("/admin")
    public List<Appointment> getAppointments(){
        return service.getAllAppointments();
    }

    @PutMapping("/admin/{id}/status")
    public Appointment updateAppointmentStatus(@PathVariable long id, @RequestParam AppointmentStatus status){
        return service.updateStatus(id, status);
    }

}
