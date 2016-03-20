package de.hska.smartcoffee.studentmanagement;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String name;

    @OneToMany(mappedBy = "role")
    private List<StudentRoleAssignment> studentRoleAssignments;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<StudentRoleAssignment> getStudentRoleAssignments() {
        return studentRoleAssignments;
    }

    public void setStudentRoleAssignments(List<StudentRoleAssignment> studentRoleAssignments) {
        this.studentRoleAssignments = studentRoleAssignments;
    }
}
