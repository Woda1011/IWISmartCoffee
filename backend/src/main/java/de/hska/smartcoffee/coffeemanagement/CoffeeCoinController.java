package de.hska.smartcoffee.coffeemanagement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/coffee-coins")
public class CoffeeCoinController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CoffeeCoinController.class);

    @Autowired
    private CoffeeCoinRepository coffeeCoinRepository;

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
}

