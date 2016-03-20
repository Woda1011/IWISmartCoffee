package de.hska.smartcoffee.studentmanagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @RequestMapping(method = RequestMethod.GET, value = "/_me")
    public StudentResource login(Authentication authentication) {
        Student student = studentRepository.findByHskaId(authentication.getName());

        if (student != null) {
            StudentResource studentResource = new StudentResource();
            studentResource.setHskaId(student.getHskaId());
            studentResource.setFirstName(student.getFirstName());
            studentResource.setLastName(student.getLastName());
            studentResource.setRoles(student.getStudentRoleAssignments().stream().map(studentRoleAssignment ->
                    studentRoleAssignment.getRole().getName()).collect(Collectors.toList()));
            return studentResource;
        } else {
            throw new StudentNotFoundException(authentication.getName());
        }
    }
}
