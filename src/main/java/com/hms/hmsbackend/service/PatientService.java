package com.hms.hmsbackend.service;

import com.hms.hmsbackend.configuration.PasswordConfig;
import com.hms.hmsbackend.entity.Appointment;
import com.hms.hmsbackend.entity.Patient;
import com.hms.hmsbackend.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Patient getOrCreatePatient(Appointment appointment) {

        String name = appointment.getName().trim();
        String email = appointment.getEmail().trim().toLowerCase();
        String phone = appointment.getPhone().replaceAll("\\D", "");

        if (name.isBlank() || email.isBlank() || phone.length() < 4) {
            throw new RuntimeException(
                    "Valid patient name, email and phone are required"
            );
        }
        return createPatient(name, email, phone);
    }

    private Patient createPatient(
            String name,
            String email,
            String phone
    ) {

        Patient patient = new Patient();

        String firstName = name.split("\\s+")[0];

        // Use the last 10 digits when a country code is included.
        String localPhone = phone.length() > 10
                ? phone.substring(phone.length() - 10)
                : phone;

        String password = firstName + localPhone.substring(0, 4);

        patient.setName(name);
        patient.setEmail(email);
        patient.setPhone(phone);
        //jab password encrypt karke save karung tab ke liye
//        patient.setPassword(passwordEncoder.encode(password));
        // this one is for only without encryption so login and testing ke liye easy ho
        patient.setPassword(password);
        patient.setEnabled(true);
        patient.setMustChangePassword(false);

        return patientRepository.save(patient);
    }

    public String generateLoginPassword(Patient patient) {

        String phone = patient.getPhone();

        String localPhone = phone.length() > 10
                ? phone.substring(phone.length() - 10)
                : phone;

        String firstName = patient.getName().trim().split("\\s+")[0];

        return firstName + localPhone.substring(0, 4);
    }
}

