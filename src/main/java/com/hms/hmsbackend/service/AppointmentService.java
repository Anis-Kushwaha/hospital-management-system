package com.hms.hmsbackend.service;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.AppointmentStatus;
import com.hms.hmsbackend.entity.Doctor;
import com.hms.hmsbackend.entity.Patient;
import com.hms.hmsbackend.repository.AppointmentRepository;
import com.hms.hmsbackend.repository.DoctorRepository;
import jakarta.transaction.Transactional;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final ConsultationService consultationService;
    private final PatientService patientService;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository, ConsultationService consultationService, PatientService patientService, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.consultationService = consultationService;
        this.patientService = patientService;
        this.emailService = emailService;
    }

    @Transactional
    public Appointment saveAppointment(Appointment appointment) {

        // Find or create the patient account.
        Patient patient = patientService.getOrCreatePatient(appointment);

        // Connect the patient with this appointment.
        appointment.setPatient(patient);
        long appointmentCount =
                appointmentRepository.countByDate(appointment.getDate());

        String formattedDate = java.time.LocalDate
                .parse(appointment.getDate())
                .format(java.time.format.DateTimeFormatter.ofPattern("ddMMyy"));

        String token = String.format(
                "T-%s-%03d",
                formattedDate,
                appointmentCount + 1
        );

        appointment.setToken(token);
        // Save appointment first.
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Generate patient login password.
        String password = patientService.generateLoginPassword(patient);

        // Send login credentials to patient.
        emailService.sendPatientCredentials(patient, appointment,password);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }


    @Transactional
    public Appointment updateStatus(Long id, AppointmentStatus newStatus) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed appointment cannot be modified");
        }

        if (newStatus != AppointmentStatus.WAITING) {
            throw new RuntimeException(
                    "Admin is not Allowed to Mark any appointment completed you can only put this Appointment to Waiting Stage and Reassing Correct Dcotor again");
        }
        // Preserve the existing consultation record and its data.
        appointment.setDoctor(null);
        appointment.setStatus(AppointmentStatus.WAITING);
        return appointmentRepository.save(appointment);
    }


    @Transactional
    public Appointment assignDoctor(Long appointmentId, Long doctorId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed appointment cannot be modified");
        }

        if (appointment.getStatus() == AppointmentStatus.IN_CONSULTATION) {
            throw new RuntimeException(
                    "Doctor cannot be changed during an active consultation");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        if (!doctor.isActive()) {
            throw new RuntimeException("Doctor is inactive");
        }

        if (doctor.getDepartment() == null ||
                appointment.getDepartment() == null ||
                !doctor.getDepartment().equalsIgnoreCase(
                        appointment.getDepartment())) {

            throw new RuntimeException(
                    "Doctor does not belong to this department");
        }

        appointment.setDoctor(doctor);
        appointment.setStatus(AppointmentStatus.DOCTOR_ASSIGNED);

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment removeDoctor(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException(
                    "Doctor cannot be removed from a completed appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.IN_CONSULTATION) {
            throw new RuntimeException(
                    "Doctor cannot be removed during an active consultation");
        }

        appointment.setDoctor(null);
        appointment.setStatus(AppointmentStatus.WAITING);

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Transactional
    public Appointment updateDoctorAppointmentStatus(
            Long doctorId,
            Long appointmentId,
            AppointmentStatus newStatus
    ) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));

        if (appointment.getDoctor() == null) {
            throw new RuntimeException(
                    "No doctor assigned to this appointment");
        }

        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException(
                    "This appointment is not assigned to you");
        }

        AppointmentStatus currentStatus = appointment.getStatus();

        if (currentStatus == AppointmentStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed appointment cannot be changed");
        }

        // Start consultation.
        if (currentStatus == AppointmentStatus.DOCTOR_ASSIGNED &&
                newStatus == AppointmentStatus.IN_CONSULTATION) {

            appointment.setStatus(AppointmentStatus.IN_CONSULTATION);

            Appointment savedAppointment =
                    appointmentRepository.save(appointment);

            consultationService.createConsultation(savedAppointment);

            return savedAppointment;
        }

        // Complete consultation.
        if (currentStatus == AppointmentStatus.IN_CONSULTATION &&
                newStatus == AppointmentStatus.COMPLETED) {

            appointment.setStatus(AppointmentStatus.COMPLETED);

            Appointment savedAppointment =
                    appointmentRepository.save(appointment);

            // Both operations are inside the same transaction.
            consultationService.completeConsultation(appointmentId);

            return savedAppointment;
        }

        throw new RuntimeException(
                "Invalid appointment status change");
    }
}
