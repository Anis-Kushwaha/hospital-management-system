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
}
