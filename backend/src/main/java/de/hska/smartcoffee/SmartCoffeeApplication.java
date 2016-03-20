package de.hska.smartcoffee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartCoffeeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCoffeeApplication.class, args);
    }
}
