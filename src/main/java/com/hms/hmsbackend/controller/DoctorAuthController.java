package com.hms.hmsbackend.controller;


import com.hms.hmsbackend.dto.DoctorLoginRequest;
import com.hms.hmsbackend.dto.DoctorLoginResponse;
import com.hms.hmsbackend.entity.Doctor;
import com.hms.hmsbackend.service.DoctorAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/doctor")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorAuthController {
    private DoctorAuthService doctorAuthService;

    public DoctorAuthController(DoctorAuthService doctorAuthService){
        this.doctorAuthService = doctorAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody DoctorLoginRequest doctorLoginRequest){
        try{
            Doctor doctor = doctorAuthService.login(doctorLoginRequest.getEmail(), doctorLoginRequest.getPassword());
            DoctorLoginResponse doctorLoginResponse = new DoctorLoginResponse(
                    doctor.getId(),
                    doctor.getName(),
                    doctor.getEmail(),
                    doctor.getDepartment(),
                    doctor.getSpecialization()
            );
            return ResponseEntity.ok(doctorLoginResponse);
        }catch (RuntimeException e){
        return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
