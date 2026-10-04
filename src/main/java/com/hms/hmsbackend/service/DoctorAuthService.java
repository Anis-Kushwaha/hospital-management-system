package com.hms.hmsbackend.service;

import com.hms.hmsbackend.configuration.PasswordConfig;
import com.hms.hmsbackend.entity.Doctor;
import com.hms.hmsbackend.repository.DoctorRepository;
import org.springframework.stereotype.Service;

@Service
public class DoctorAuthService {
    private final DoctorRepository doctorRepository;
    private final PasswordConfig passwordConfig;

    public DoctorAuthService(DoctorRepository doctorRepository, PasswordConfig passwordConfig){
        this.doctorRepository = doctorRepository;
        this.passwordConfig = passwordConfig;
    }

    public Doctor login(String email, String password){
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("Doctor Not Found"));
//        if (!doctor.isActive()) {
//            throw new RuntimeException("Doctor account is inactive");
//        }

        boolean passwordMatchs = passwordConfig.passwordEncoder().matches(password, doctor.getPassword());

        if(!passwordMatchs){
            throw new RuntimeException("Wrong Password");
        }
        return doctor;
    }

}
