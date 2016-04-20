package de.hska.smartcoffee.studentmanagement.coffeelog;

import de.hska.smartcoffee.error.CoreException;
import de.hska.smartcoffee.error.ErrorMessageCode;

public class NoQuotaAvailableException extends CoreException {
    public NoQuotaAvailableException(String message) {
        super(ErrorMessageCode.NO_QUOTA_AVAILABLE, message);
    }
}
