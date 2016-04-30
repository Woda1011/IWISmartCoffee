package de.hska.smartcoffee.studentmanagement;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.stream.Collectors;

public class StudentResource {

    private String hskaId;
    private String firstName;
    private String lastName;
    private String campusCardId;
    private String password;
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

    public String getCampusCardId() {
        return campusCardId;
    }

    public void setCampusCardId(String campusCardId) {
        this.campusCardId = campusCardId;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }
}
