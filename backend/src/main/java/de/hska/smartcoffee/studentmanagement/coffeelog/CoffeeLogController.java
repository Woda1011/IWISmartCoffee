package de.hska.smartcoffee.studentmanagement.coffeelog;

import de.hska.smartcoffee.studentmanagement.Student;
import de.hska.smartcoffee.studentmanagement.StudentNotFoundException;
import de.hska.smartcoffee.studentmanagement.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/{hskaId}/coffee-log")
public class CoffeeLogController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CoffeeLogService coffeeLogService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("isAuthenticated() && #hskaId == principal.username")
    public CoffeeLogResource getCoffeeLog(@PathVariable String hskaId) {
        Student student = getStudent(hskaId);

        // TODO Calculate averageConsumption
        return new CoffeeLogResource(coffeeLogService.getQuota(student), null);
    }

    @RequestMapping(method = RequestMethod.POST)
    @PreAuthorize("isAuthenticated() && #hskaId == principal.username")
    public CoffeeLogResource addCoffeeLog(@PathVariable String hskaId) {
        Student student = getStudent(hskaId);

        Long quota = coffeeLogService.getQuota(student);
        if (quota == 0) {
            throw new NoQuotaAvailableException("You have no more quota available. Please buy a new coffee coin!");
        } else {
            coffeeLogService.addCoffeeLog(student);
        }

        // TODO Calculate averageConsumption
        return new CoffeeLogResource(coffeeLogService.getQuota(student), null);
    }

    private Student getStudent(@PathVariable String hskaId) {
        Student student = studentRepository.findByHskaId(hskaId);

        if (student == null) {
            throw new StudentNotFoundException("Could not find student with hskaId " + hskaId);
        }
        return student;
    }
}
