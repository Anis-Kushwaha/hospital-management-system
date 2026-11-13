package com.hms.hmsbackend.service;

import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.AppointmentStatus;
import com.hms.hmsbackend.entity.Consultation;
import com.hms.hmsbackend.repository.AppointmentRepository;
import com.hms.hmsbackend.repository.ConsultationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class ConsultationService {

    private ConsultationRepository consultationRepository;
    private AppointmentRepository appointmentRepository;

    ConsultationService(ConsultationRepository consultationRepository,
                        AppointmentRepository appointmentRepository) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Consultation createConsultation(Appointment appointment) {
        if (consultationRepository.existsByAppointmentId(appointment.getId())) {
            return consultationRepository.findByAppointmentId(appointment.getId())
                    .orElseThrow(() -> new RuntimeException("Consultation could not be loaded"));
        }
        Consultation consultation = new Consultation();
        consultation.setAppointment(appointment);
        consultation.setStartedAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public Consultation getByAppointmentId(Long appointmentId) {
        return consultationRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
    }

    @Transactional
    public Consultation completeConsultation(Long appointmentId) {
        Consultation consultation = getByAppointmentId(appointmentId);
        if (consultation.getCompletedAt() == null) {
            consultation.setCompletedAt(LocalDateTime.now());
        }
        return consultationRepository.save(consultation);
    }

    public Consultation updateConsultation(Long doctorID, Long appointmentId, String diagnosis, String notes) {
        // 1. Verify appointment exists
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Appointment not found"
                ));

        // 2. Verify doctor is assigned
        if (appointment.getDoctor() == null || !appointment.getDoctor().getId().equals(doctorID)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This appointment is not assigned to you");
        }

        // 3. Verify appointment status
        if (appointment.getStatus() != AppointmentStatus.IN_CONSULTATION) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Consultation can only be updated while appointment is IN_CONSULTATION"
            );
        }

        // 4. Get existing consultation
        Consultation consultation = getByAppointmentId(appointmentId);

        consultation.setDiagnosis(diagnosis.trim());
        consultation.setNotes(notes == null || notes.isBlank() ? null : notes.trim());
        return consultationRepository.save(consultation);
    }

    @Transactional(readOnly = true)
    public Consultation getDoctorConsultation(
            Long doctorId,
            Long appointmentId
    ) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Appointment not found"
                ));

        if (appointment.getDoctor() == null ||
                !appointment.getDoctor().getId().equals(doctorId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "This appointment is not assigned to you"
            );
        }

        return getByAppointmentId(appointmentId);
    }

}
