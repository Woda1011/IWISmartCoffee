package de.hska.smartcoffee.security;

import de.hska.smartcoffee.studentmanagement.Student;
import de.hska.smartcoffee.studentmanagement.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        Student student = studentRepository.findByHskaId(username);

        if (student != null) {
            return new User(username, student.getPassword(), student.getStudentRoleAssignments().stream().map
                    (studentRoleAssignment -> new SimpleGrantedAuthority(studentRoleAssignment.getRole().getName()))
                    .collect(Collectors.toList()));
        } else {
            throw new UsernameNotFoundException(username);
        }
    }
}
