package de.hska.smartcoffee.error;

public enum ErrorMessageCode {

    ACCESS_DENIED("error.access_denied"),//
    BAD_CREDENTIALS("error.bad_credentials"),//
    INTERNAL_SERVER_ERROR("error.internal_server_error"),
    STUDENT_NOT_FOUND("error.student_not_found"),
    STUDENT_ALREADY_EXISTS("error.student_already_exists");

    private String value;

    private ErrorMessageCode(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
