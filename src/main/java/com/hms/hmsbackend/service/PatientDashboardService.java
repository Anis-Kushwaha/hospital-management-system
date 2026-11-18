package com.hms.hmsbackend.service;

import com.hms.hmsbackend.dto.PatientDashboardResponse;
import com.hms.hmsbackend.entity.*;
import com.hms.hmsbackend.repository.AppointmentRepository;
import com.hms.hmsbackend.repository.ConsultationRepository;
import com.hms.hmsbackend.repository.PatientRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PatientDashboardService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;

    public PatientDashboardService(
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            ConsultationRepository consultationRepository) {

        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.consultationRepository = consultationRepository;
    }

    @Transactional(readOnly = true)
    public PatientDashboardResponse getDashboard(Long patientId) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Patient not found"));

        if (!patient.isEnabled() ||
                (patient.getAccessExpiresAt() != null &&
                        !patient.getAccessExpiresAt().isAfter(LocalDateTime.now()))) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Patient account access has expired");
        }

        List<Appointment> appointments =
                appointmentRepository.findByPatient_IdOrderByIdDesc(patientId);

        PatientDashboardResponse response = new PatientDashboardResponse();

        // Patient profile
        PatientDashboardResponse.PatientProfile profile =
                new PatientDashboardResponse.PatientProfile();

        profile.id = patient.getId();
        profile.name = patient.getName();
        profile.email = patient.getEmail();
        profile.phone = patient.getPhone();
        profile.createdAt = patient.getCreatedAt();
        profile.accessExpiresAt = patient.getAccessExpiresAt();

        response.patient = profile;

        if (appointments.isEmpty()) {
            response.appointments = new ArrayList<>();
            response.latestAppointment = null;
            return response;
        }

        // Fetch all consultations in one repository query
        List<Long> appointmentIds = appointments.stream()
                .map(Appointment::getId)
                .toList();

        Map<Long, Consultation> consultationMap =
                consultationRepository.findByAppointmentIdIn(appointmentIds)
                        .stream()
                        .collect(Collectors.toMap(
                                consultation -> consultation.getAppointment().getId(),
                                Function.identity()
                        ));

        // Cache queue results for appointments belonging to the same doctor/date
        Map<String, List<Appointment>> queueCache = new HashMap<>();

        List<PatientDashboardResponse.AppointmentDetails> result =
                new ArrayList<>();

        for (Appointment appointment : appointments) {

            PatientDashboardResponse.AppointmentDetails details =
                    new PatientDashboardResponse.AppointmentDetails();

            details.id = appointment.getId();
            details.token = appointment.getToken();
            details.date = appointment.getDate();
            details.slot = appointment.getSlot();
            details.department = appointment.getDepartment();
            details.reason = appointment.getReason();

            details.status = appointment.getStatus() != null
                    ? appointment.getStatus().name()
                    : null;

            // Doctor information
            Doctor doctor = appointment.getDoctor();

            if (doctor != null) {
                PatientDashboardResponse.DoctorDetails doctorDetails =
                        new PatientDashboardResponse.DoctorDetails();

                doctorDetails.id = doctor.getId();
                doctorDetails.name = doctor.getName();
                doctorDetails.email = doctor.getEmail();
                doctorDetails.department = doctor.getDepartment();
                doctorDetails.specialization = doctor.getSpecialization();
                doctorDetails.phone = doctor.getPhone();

                details.doctor = doctorDetails;

                // Queue information
                details.queue = calculateQueue(appointment, queueCache);
            }

            // Consultation information
            Consultation consultation =
                    consultationMap.get(appointment.getId());

            if (consultation != null) {
                details.consultation = mapConsultation(consultation);
            }

            result.add(details);
        }

        response.appointments = result;
        response.latestAppointment = result.get(0);

        return response;
    }

    private PatientDashboardResponse.QueueDetails calculateQueue(
            Appointment appointment,
            Map<String, List<Appointment>> queueCache) {

        AppointmentStatus status = appointment.getStatus();

        if (status != AppointmentStatus.DOCTOR_ASSIGNED &&
                status != AppointmentStatus.IN_CONSULTATION) {
            return null;
        }

        Long doctorId = appointment.getDoctor().getId();
        String date = appointment.getDate();

        String cacheKey = doctorId + "_" + date;

        List<Appointment> queueAppointments = queueCache.computeIfAbsent(
                cacheKey,
                key -> appointmentRepository
                        .findByDoctorIdAndDateOrderByIdAsc(doctorId, date)
                        .stream()
                        .filter(a ->
                                a.getStatus() == AppointmentStatus.DOCTOR_ASSIGNED ||
                                        a.getStatus() == AppointmentStatus.IN_CONSULTATION)
                        .toList()
        );

        int position = -1;

        for (int i = 0; i < queueAppointments.size(); i++) {
            if (queueAppointments.get(i).getId().equals(appointment.getId())) {
                position = i + 1;
                break;
            }
        }

        if (position == -1) {
            return null;
        }

        PatientDashboardResponse.QueueDetails queue =
                new PatientDashboardResponse.QueueDetails();

        queue.queuePosition = position;
        queue.patientsAhead = position - 1;
        queue.totalPatients = queueAppointments.size();

        queue.currentlyServing = status == AppointmentStatus.IN_CONSULTATION;

        queue.currentlyServingToken = queueAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.IN_CONSULTATION)
                .map(Appointment::getToken)
                .findFirst()
                .orElse(null);

        // We have not implemented consultation-duration estimates.
        queue.estimatedWaitMinutes = null;

        return queue;
    }

    private PatientDashboardResponse.ConsultationDetails mapConsultation(
            Consultation consultation) {

        PatientDashboardResponse.ConsultationDetails details =
                new PatientDashboardResponse.ConsultationDetails();

        details.id = consultation.getId();
        details.diagnosis = consultation.getDiagnosis();
        details.notes = consultation.getNotes();
        details.startedAt = consultation.getStartedAt();
        details.completedAt = consultation.getCompletedAt();

        details.tests = consultation.getTests().stream()
                .map(test -> {
                    PatientDashboardResponse.TestDetails testDetails =
                            new PatientDashboardResponse.TestDetails();

                    testDetails.id = test.getId();
                    testDetails.testName = test.getTestName();

                    return testDetails;
                })
                .toList();

        details.prescriptions = consultation.getPrescriptions().stream()
                .map(prescription -> {
                    PatientDashboardResponse.PrescriptionDetails prescriptionDetails =
                            new PatientDashboardResponse.PrescriptionDetails();

                    prescriptionDetails.id = prescription.getId();
                    prescriptionDetails.medicineName =
                            prescription.getMedicineName();
                    prescriptionDetails.dosage = prescription.getDosage();
                    prescriptionDetails.duration = prescription.getDuration();
                    prescriptionDetails.instructions =
                            prescription.getInstructions();

                    return prescriptionDetails;
                })
                .toList();

        return details;
    }
}
