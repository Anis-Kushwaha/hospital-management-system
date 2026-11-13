package com.hms.hmsbackend.service;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.AppointmentStatus;
import com.hms.hmsbackend.entity.Doctor;
import com.hms.hmsbackend.repository.AppointmentRepository;
import com.hms.hmsbackend.repository.DoctorRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final ConsultationService consultationService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository, ConsultationService consultationService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.consultationService = consultationService;
    }

    public Appointment saveAppointment(Appointment appointment) {
        long appointmentCount = appointmentRepository.countByDate(appointment.getDate());

        String token = String.format(
                "T-%03d",
                appointmentCount + 1
        );

        appointment.setToken(token);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment updateStatus(Long id, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Completed appointment cannot be modified");
        }

        if (newStatus == AppointmentStatus.WAITING) {
            appointment.setDoctor(null);
        }

        if (newStatus == AppointmentStatus.COMPLETED && appointment.getDoctor() == null) {
            throw new RuntimeException("Cannot complete appointment without an assigned doctor");
        }
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }

    public Appointment assignDoctor(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Completed appointment cannot be modified");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("doctor not found"));

        if (!doctor.isActive()) {
            throw new RuntimeException("doctor is inactive");
        }

        if (!doctor.getDepartment().equalsIgnoreCase(appointment.getDepartment())) {
            throw new RuntimeException("doctor does not belong to this department");
        }
        appointment.setDoctor(doctor);
        appointment.setStatus(AppointmentStatus.DOCTOR_ASSIGNED);
        return appointmentRepository.save(appointment);
    }

    public Appointment removeDoctor(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Doctor cannot be removed from a completed appointment");
        }

        appointment.setDoctor(null);
        appointment.setStatus(AppointmentStatus.WAITING);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Transactional
    public Appointment updateDoctorAppointmentStatus(Long doctorId, Long appointmentId,
                                                     AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("appointment not found"));

        if (appointment.getDoctor() == null) {
            throw new RuntimeException("No doctor assigned to this appointment");
        }
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("This appointment is not assigned to you");
        }
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed appointment cannot be changed"
            );
        }
        AppointmentStatus currentStatus = appointment.getStatus();

        if (currentStatus == AppointmentStatus.DOCTOR_ASSIGNED
                && newStatus == AppointmentStatus.IN_CONSULTATION
        ) {
            appointment.setStatus(AppointmentStatus.IN_CONSULTATION);
            Appointment savedAppointment = appointmentRepository.save(appointment);
            // Create consultation record
            consultationService.createConsultation(savedAppointment);
            return savedAppointment;

        } else if (currentStatus == AppointmentStatus.IN_CONSULTATION
                && newStatus == AppointmentStatus.COMPLETED
        ) {
            appointment.setStatus(AppointmentStatus.COMPLETED);
            // Save appointment
            Appointment savedAppointment = appointmentRepository.save(appointment);
            // Mark consultation as completed
            consultationService.completeConsultation(appointmentId);

            return savedAppointment;
        } else {
            throw new RuntimeException("Invalid appointment status change");
        }
    }
}
