package de.hska.smartcoffee.coffeemanagement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoffeeCoinRepository extends JpaRepository<CoffeeCoin, Long> {

    List<CoffeeCoin> findByIsUsedFalse();
}
