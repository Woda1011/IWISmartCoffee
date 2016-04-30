package de.hska.smartcoffee.studentmanagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentRoleAssignmentRepository studentRoleAssignmentRepository;

    @RequestMapping(method = RequestMethod.GET, value = "/_me")
    public StudentResource login(Authentication authentication) {
        Student student = studentRepository.findByHskaId(authentication.getName());

        if (student != null) {
            StudentResource studentResource = new StudentResource();
            studentResource.setHskaId(student.getHskaId());
            studentResource.setFirstName(student.getFirstName());
            studentResource.setLastName(student.getLastName());
            studentResource.setCampusCardId(student.getCampusCardId());
            studentResource.setRoles(student.getStudentRoleAssignments().stream().map(studentRoleAssignment ->
                    studentRoleAssignment.getRole().getName()).collect(Collectors.toList()));
            return studentResource;
        } else {
            throw new StudentNotFoundException(authentication.getName());
        }
    }

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public Page<StudentResource> all(Pageable pageable) {
        return this.studentRepository.findByIsDeletedFalseOrderByCreatedAtDesc(pageable).map(StudentResource::new);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{hskaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResource findOne(@PathVariable String hskaId) {
        Student student = this.studentRepository.findByHskaId(hskaId);
        if (student == null) {
            throw new StudentNotFoundException("Could not find student with hskaId " + hskaId);
        }

        return new StudentResource(student);
    }

    @RequestMapping(method = RequestMethod.POST)
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResource add(@RequestBody StudentResource studentResource) {
        Student foundStudent = studentRepository.findByHskaId(studentResource.getHskaId());

        if (foundStudent != null) {
            throw new StudentAlreadyExistsException("Student already exists");
        }

        Student student = new Student();
        Date creationDate = new Date();

        student.setHskaId(studentResource.getHskaId());
        student.setFirstName(studentResource.getFirstName());
        student.setLastName(studentResource.getLastName());
        student.setPassword(new BCryptPasswordEncoder().encode(studentResource.getPassword()));
        student.setCreatedAt(creationDate);
        student.setUpdatedAt(creationDate);

        Student savedStudent = studentRepository.save(student);

        if (studentResource.getRoles() == null) {
            List<String> defaultRoles = new ArrayList<>();
            defaultRoles.add("ROLE_USER");
            studentResource.setRoles(defaultRoles);
        }

        savedStudent.setStudentRoleAssignments(studentResource.getRoles().stream().map(roleName ->
                getStudentRoleAssignment(savedStudent, roleName)).collect(Collectors.toList()));

        return new StudentResource(savedStudent);
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/{hskaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResource update(@PathVariable String hskaId, @RequestBody StudentResource studentResource) {
        Student student = this.studentRepository.findByHskaId(hskaId);
        if (student == null) {
            throw new StudentNotFoundException("Could not find student with hskaId " + hskaId);
        }

        student.setCampusCardId(studentResource.getCampusCardId());
        student.setLastName(studentResource.getLastName());
        student.setUpdatedAt(new Date());

        Student savedStudent = studentRepository.save(student);
        savedStudent.setStudentRoleAssignments(studentResource.getRoles().stream().map(roleName -> {
            // delete assignments first because we can remove roles from student
            studentRoleAssignmentRepository.findByStudent(savedStudent).forEach(assignment ->
                    studentRoleAssignmentRepository.delete(assignment));
            return getStudentRoleAssignment(savedStudent, roleName);
        }).collect(Collectors.toList()));

        return new StudentResource(savedStudent);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/{hskaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String hskaId) {
        Student student = this.studentRepository.findByHskaId(hskaId);
        if (student == null) {
            throw new StudentNotFoundException("Could not find student with hskaId " + hskaId);
        }

        student.setDeleted(true);
        student.setUpdatedAt(new Date());

        studentRepository.save(student);
    }

    private StudentRoleAssignment getStudentRoleAssignment(Student student, String roleName) {
        Role role = roleRepository.findByName(roleName);
        if (role != null) {
            StudentRoleAssignment studentRoleAssignment = new StudentRoleAssignment();
            studentRoleAssignment.setRole(role);
            studentRoleAssignment.setStudent(student);
            return studentRoleAssignmentRepository.save(studentRoleAssignment);
        }
        return null;
    }
}
