package de.hska.smartcoffee.coffeemanagement;

import de.hska.smartcoffee.studentmanagement.Student;
import de.hska.smartcoffee.studentmanagement.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/coffee-coins")
public class CoffeeCoinController {

    @Autowired
    private CoffeeCoinRepository coffeeCoinRepository;

    @Autowired
    private UserCoffeeCoinRepository userCoinRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CoffeeCoinService coffeeCoinService;

    @RequestMapping(method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public List<CoffeeCoin> findAllNotUsed() {
        return coffeeCoinRepository.findByIsUsedFalse();
    }

    @RequestMapping(method = RequestMethod.GET, value = "/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public void generateCoffeeCoins(@RequestParam Long coinValue, @RequestParam Long amount, HttpServletResponse
            response) throws IOException {
        coffeeCoinService.writeCoffeeCoinsToResponse(coinValue, amount, response);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/{coinKey}")
    @PreAuthorize("isAuthenticated()")
    public void addUserCoffeeCoinMapping(@PathVariable String coinKey, @AuthenticationPrincipal User user) {
        CoffeeCoin coffeeCoin = coffeeCoinRepository.findByCoinKeyAndIsUsedFalse(coinKey);

        if (coffeeCoin == null) {
            throw new CoffeeCoinDoesNotExistsOrIsUsedException("The coffee coin with key '" + coinKey + "' does not " +
                    "exists or is already used!");
        }

        Student student = studentRepository.findByHskaId(user.getUsername());

        saveStudentCoffeeCoin(coffeeCoin, student);
        setCoffeeCoinIsUsed(coffeeCoin);
    }

    private void saveStudentCoffeeCoin(CoffeeCoin coffeeCoin, Student student) {
        UserCoffeeCoin userCoffeeCoin = new UserCoffeeCoin();
        userCoffeeCoin.setCreatedAt(new Date());
        userCoffeeCoin.setCoffeeCoin(coffeeCoin);
        userCoffeeCoin.setStudent(student);

        userCoinRepository.save(userCoffeeCoin);
    }

    private void setCoffeeCoinIsUsed(CoffeeCoin coffeeCoin) {
        coffeeCoin.setUsed(true);
        coffeeCoinRepository.save(coffeeCoin);
    }
}

