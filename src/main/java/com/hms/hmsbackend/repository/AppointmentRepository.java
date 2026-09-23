package com.hms.hmsbackend.repository;

import com.hms.hmsbackend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long>{

    long countByDate(String date);
}
