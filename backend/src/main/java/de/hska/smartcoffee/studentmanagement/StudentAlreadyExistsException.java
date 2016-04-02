package de.hska.smartcoffee.studentmanagement;

import de.hska.smartcoffee.error.CoreException;
import de.hska.smartcoffee.error.ErrorMessageCode;

public class StudentAlreadyExistsException extends CoreException {
    public StudentAlreadyExistsException(String message) {
        super(ErrorMessageCode.STUDENT_ALREADY_EXISTS, message);
    }
}
