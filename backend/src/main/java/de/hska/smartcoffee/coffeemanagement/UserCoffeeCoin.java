package de.hska.smartcoffee.coffeemanagement;

import de.hska.smartcoffee.studentmanagement.Student;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
public class UserCoffeeCoin {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private Date createdAt;

    @ManyToOne
    private Student student;

    @ManyToOne
    private CoffeeCoin coffeeCoin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public CoffeeCoin getCoffeeCoin() {
        return coffeeCoin;
    }

    public void setCoffeeCoin(CoffeeCoin coffeeCoin) {
        this.coffeeCoin = coffeeCoin;
    }
}
