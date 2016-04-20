package de.hska.smartcoffee.coffeemanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCoffeeCoinRepository extends JpaRepository<UserCoffeeCoin, Long> {
}
