package com.hms.hmsbackend.service;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.AppointmentStatus;
import com.hms.hmsbackend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment saveAppointment(Appointment appointment){
        long appointmentCount = appointmentRepository.countByDate(appointment.getDate());

        String token = String.format(
                "T-%03d",
                appointmentCount+1
        );

        appointment.setToken(token);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateStatus(Long id, AppointmentStatus Status){
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("appointment not found"));
        appointment.setStatus(Status);
        return appointmentRepository.save(appointment);
    }
}
