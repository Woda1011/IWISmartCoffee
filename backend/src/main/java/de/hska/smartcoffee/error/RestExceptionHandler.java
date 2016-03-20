package de.hska.smartcoffee.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(CoreException.class)
    public ResponseEntity<RestError> applicationErrors(CoreException ex) {
        return new ResponseEntity<>(new RestError(ex), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<RestError> accessDenied(AccessDeniedException ex) {
        return getResponseEntity(ErrorMessageCode.ACCESS_DENIED, ex, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestError> anyOtherServerException(Exception ex) {
        return getResponseEntity(ErrorMessageCode.INTERNAL_SERVER_ERROR, ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<RestError> getResponseEntity(ErrorMessageCode code, Exception ex, HttpStatus httpStatus) {
        RestError restError = new RestError(code, ex.getMessage());
        return new ResponseEntity<>(restError, httpStatus);
    }
}
