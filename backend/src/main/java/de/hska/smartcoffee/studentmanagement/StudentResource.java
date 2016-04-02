package de.hska.smartcoffee.studentmanagement;

import java.util.List;
import java.util.stream.Collectors;

public class StudentResource {

    private String hskaId;
    private String firstName;
    private String lastName;
    private Long campusCardId;
    private List<String> roles;

    public StudentResource() {
    }

    public StudentResource(Student student) {
        this.hskaId = student.getHskaId();
        this.firstName = student.getFirstName();
        this.lastName = student.getLastName();
        this.campusCardId = student.getCampusCardId();
        this.roles = student.getStudentRoleAssignments().stream().map(studentRoleAssignment -> studentRoleAssignment
                .getRole().getName()).collect(Collectors.toList());
    }

    public String getHskaId() {
        return hskaId;
    }

    public void setHskaId(String hskaId) {
        this.hskaId = hskaId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Long getCampusCardId() {
        return campusCardId;
    }

    public void setCampusCardId(Long campusCardId) {
        this.campusCardId = campusCardId;
    }
}
