package de.hska.smartcoffee.studentmanagement;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @RequestMapping(method = RequestMethod.GET, value = "/_me")
    public StudentResource login(Authentication authentication) {
        StudentResource studentResource = new StudentResource();
        studentResource.setUsername(authentication.getName());
        studentResource.setRoles(authentication.getAuthorities().stream().map(authority -> authority.getAuthority())
                .collect(Collectors.toList()));
        return studentResource;
    }
}
