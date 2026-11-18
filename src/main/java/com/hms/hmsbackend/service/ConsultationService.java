package com.hms.hmsbackend.service;

import com.hms.hmsbackend.dto.ConsultationUpdateRequest;
import com.hms.hmsbackend.dto.PrescriptionRequest;
import com.hms.hmsbackend.entity.*;
import com.hms.hmsbackend.repository.AppointmentRepository;
import com.hms.hmsbackend.repository.ConsultationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultationService {

    private ConsultationRepository consultationRepository;
    private AppointmentRepository appointmentRepository;

    ConsultationService(ConsultationRepository consultationRepository,
                        AppointmentRepository appointmentRepository) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public Consultation createConsultation(Appointment appointment) {

        if (appointment.getStatus() != AppointmentStatus.IN_CONSULTATION) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Consultation can only be created for an active appointment"
            );
        }
        return consultationRepository
                .findByAppointmentId(appointment.getId())
                .orElseGet(() -> {
                    Consultation consultation = new Consultation();
                    consultation.setAppointment(appointment);
                    consultation.setStartedAt(LocalDateTime.now());

                    return consultationRepository.save(consultation);
                });
    }

    @Transactional(readOnly = true)
    public Consultation getByAppointmentId(Long appointmentId) {

        return consultationRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Consultation not found"
                ));
    }

    @Transactional
    public Consultation completeConsultation(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Appointment not found"
                ));
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Appointment must be completed before completing its consultation");}

        Consultation consultation = getByAppointmentId(appointmentId);
        if (consultation.getCompletedAt() == null) {
            consultation.setCompletedAt(LocalDateTime.now());
        }
        return consultationRepository.save(consultation);
    }

    @Transactional
    public Consultation updateConsultation(Long doctorId, Long appointmentId, ConsultationUpdateRequest request) {

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

        if (appointment.getStatus() != AppointmentStatus.IN_CONSULTATION) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Consultation can only be updated while appointment is IN_CONSULTATION"
            );
        }

        Consultation consultation = getByAppointmentId(appointmentId);

        if (consultation.getCompletedAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Completed consultations cannot be modified"
            );
        }

        if (request.getDiagnosis() == null ||
                request.getDiagnosis().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Diagnosis is required"
            );
        }
        // Update diagnosis and notes.
        consultation.setDiagnosis(request.getDiagnosis().trim());

        consultation.setNotes(
                request.getNotes() == null || request.getNotes().isBlank()
                        ? null
                        : request.getNotes().trim()
        );

        // Replace existing tests.
        consultation.clearTests();

        List<String> tests = request.getTests();

        if (tests != null) {
            for (String testName : tests) {

                if (testName == null || testName.isBlank()) {
                    continue;
                }

                ConsultationTest test = new ConsultationTest();
                test.setTestName(testName.trim());

                consultation.addTest(test);
            }
        }

        // Replace existing prescriptions.
        consultation.clearPrescriptions();

        List<PrescriptionRequest> prescriptions =
                request.getPrescriptions();

        if (prescriptions != null) {
            for (PrescriptionRequest item : prescriptions) {

                if (item == null) {
                    continue;
                }

                if (item.getMedicineName() == null ||
                        item.getMedicineName().isBlank() ||
                        item.getDosage() == null ||
                        item.getDosage().isBlank()) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Medicine name and dosage are required"
                    );
                }
                Prescription prescription = new Prescription();

                prescription.setMedicineName(
                        item.getMedicineName().trim()
                );

                prescription.setDosage(
                        item.getDosage().trim()
                );

                prescription.setDuration(
                        item.getDuration() == null ||
                                item.getDuration().isBlank()
                                ? null
                                : item.getDuration().trim()
                );

                prescription.setInstructions(
                        item.getInstructions() == null ||
                                item.getInstructions().isBlank()
                                ? null
                                : item.getInstructions().trim()
                );
                consultation.addPrescription(prescription);
            }
        }
        return consultationRepository.save(consultation);
    }

    @Transactional(readOnly = true)
    public Consultation getDoctorConsultation(Long doctorId, Long appointmentId) {
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
