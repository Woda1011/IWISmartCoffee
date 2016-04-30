package de.hska.smartcoffee.studentmanagement;

import de.hska.smartcoffee.common.SmartCoffeeEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
public class Student extends SmartCoffeeEntity {

    private String firstName;

    private String lastName;

    @Column(unique = true)
    @NotNull
    @Size(max = 8)
    private String hskaId;

    private String campusCardId;

    @NotNull
    private String password;

    @OneToMany(mappedBy = "student", fetch = FetchType.EAGER)
    private List<StudentRoleAssignment> studentRoleAssignments;

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

    public String getHskaId() {
        return hskaId;
    }

    public void setHskaId(String hskaId) {
        this.hskaId = hskaId;
    }

    public String getCampusCardId() {
        return campusCardId;
    }

    public void setCampusCardId(String campusCardId) {
        this.campusCardId = campusCardId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<StudentRoleAssignment> getStudentRoleAssignments() {
        return studentRoleAssignments;
    }

    public void setStudentRoleAssignments(List<StudentRoleAssignment> studentRoleAssignments) {
        this.studentRoleAssignments = studentRoleAssignments;
    }
}
