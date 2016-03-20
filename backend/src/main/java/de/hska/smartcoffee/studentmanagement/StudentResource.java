package de.hska.smartcoffee.studentmanagement;

import java.util.List;

public class StudentResource {

    private String hskaId;
    private String firstName;
    private String lastName;
    private List<String> roles;

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
}
