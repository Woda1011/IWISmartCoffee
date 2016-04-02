package de.hska.smartcoffee.studentmanagement;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRoleAssignmentRepository extends CrudRepository<StudentRoleAssignment, Long> {

    List<StudentRoleAssignment> findByStudent(Student student);
}
