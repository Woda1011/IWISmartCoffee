package de.hska.smartcoffee.studentmanagement.coffeelog;

import de.hska.smartcoffee.studentmanagement.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CoffeeLogRepository extends JpaRepository<CoffeeLog, Long> {

    @Query("SELECT COUNT(c) FROM CoffeeLog c WHERE c.student=?1")
    Long getNumberOfCoffeeLogs(Student student);
}
