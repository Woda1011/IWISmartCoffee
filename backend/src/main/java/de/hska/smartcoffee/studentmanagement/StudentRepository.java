package de.hska.smartcoffee.studentmanagement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Student findByHskaId(String hskaId);

    Student findByCampusCardId(String campusCardId);

    Page<Student> findByCampusCardIdIsNullAndIsDeletedFalse(Pageable pageable);

    Page<Student> findByHskaIdAndCampusCardIdIsNullAndIsDeletedFalse(String hskaId, Pageable pageable);
}
