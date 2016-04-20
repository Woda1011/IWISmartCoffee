package de.hska.smartcoffee.coffeemanagement;

import de.hska.smartcoffee.studentmanagement.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCoffeeCoinRepository extends JpaRepository<UserCoffeeCoin, Long> {

    List<UserCoffeeCoin> findByStudent(Student student);
}
