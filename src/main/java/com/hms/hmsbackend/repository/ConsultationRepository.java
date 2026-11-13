package com.hms.hmsbackend.repository;

import com.hms.hmsbackend.entity.Consultation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsultationRepository extends CrudRepository<Consultation, Long> {
    Optional<Consultation> findByAppointmentId(Long AppointmentId);

    boolean existsByAppointmentId(Long AppointmentId);
}
