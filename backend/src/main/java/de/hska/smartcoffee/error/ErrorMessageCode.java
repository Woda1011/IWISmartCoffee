package de.hska.smartcoffee.error;

public enum ErrorMessageCode {

    ACCESS_DENIED("error.access_denied"),//
    BAD_CREDENTIALS("error.bad_credentials"),//
    INTERNAL_SERVER_ERROR("error.internal_server_error")
    ;

    private String value;

    private ErrorMessageCode(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
