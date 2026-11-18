package com.hms.hmsbackend.repository;

import com.hms.hmsbackend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>{

    long countByDate(String date);
    List<Appointment> findByDoctorId(Long doctorId);
    // Patient's complete appointment history
    List<Appointment> findByPatient_IdOrderByIdDesc(Long patientId);

    // One doctor's appointments on one date, in booking order
    List<Appointment> findByDoctorIdAndDateOrderByIdAsc(Long doctorId, String date);
}
