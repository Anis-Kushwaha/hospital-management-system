package com.hms.hmsbackend.repository;

import com.hms.hmsbackend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor,Long> {

    boolean existsByEmail(String email);

}
