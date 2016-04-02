package de.hska.smartcoffee.studentmanagement;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRoleAssignmentRepository extends CrudRepository<StudentRoleAssignment, Long> {
}
