package de.hska.smartcoffee.studentmanagement;

import de.hska.smartcoffee.error.CoreException;
import de.hska.smartcoffee.error.ErrorMessageCode;

public class StudentNotFoundException extends CoreException {
    public StudentNotFoundException(String message) {
        super(ErrorMessageCode.STUDENT_NOT_FOUND, message);
    }
}
