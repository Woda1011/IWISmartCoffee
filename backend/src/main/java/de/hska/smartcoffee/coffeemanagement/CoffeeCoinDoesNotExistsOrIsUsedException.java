package de.hska.smartcoffee.coffeemanagement;

import de.hska.smartcoffee.error.CoreException;
import de.hska.smartcoffee.error.ErrorMessageCode;

public class CoffeeCoinDoesNotExistsOrIsUsedException extends CoreException {
    public CoffeeCoinDoesNotExistsOrIsUsedException(String message) {
        super(ErrorMessageCode.COFFEE_COIN_DOES_NOT_EXISTS_OR_IS_USED, message);
    }
}
