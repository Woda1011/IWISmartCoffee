package de.hska.smartcoffee.studentmanagement.coffeelog;

import de.hska.smartcoffee.coffeemanagement.UserCoffeeCoin;
import de.hska.smartcoffee.coffeemanagement.UserCoffeeCoinRepository;
import de.hska.smartcoffee.studentmanagement.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CoffeeLogService {

    @Autowired
    private CoffeeLogRepository coffeeLogRepository;

    @Autowired
    private UserCoffeeCoinRepository userCoinRepository;

    public Long getQuota(Student student) {
        return getSumValueOfCoffeeCoins(student) - getNumberOfCoffeeLogs(student);
    }

    public CoffeeLog addCoffeeLog(Student student) {
        return coffeeLogRepository.save(new CoffeeLog(new Date(), student));
    }

    private Long getSumValueOfCoffeeCoins(Student student) {
        List<UserCoffeeCoin> registeredCoffeeCoins = userCoinRepository.findByStudent(student);
        final Long[] availableCoffeeContent = {0L};

        registeredCoffeeCoins.stream().forEach(userCoffeeCoin -> availableCoffeeContent[0] += userCoffeeCoin
                .getCoffeeCoin().getCoinValue());
        return availableCoffeeContent[0];
    }

    private Long getNumberOfCoffeeLogs(Student student) {
        Long numberOfCoffeeLogs = coffeeLogRepository.getNumberOfCoffeeLogs(student);
        return numberOfCoffeeLogs;
    }
}
