package de.hska.smartcoffee.error;

import java.util.HashMap;
import java.util.Map;

public class CoreException extends RuntimeException {

    private final ErrorMessageCode errorCode;

    private final Map<String, Object> arguments = new HashMap<>();

    public CoreException(ErrorMessageCode errorCode, String internalMessage) {
        super(internalMessage);
        this.errorCode = errorCode;
    }


    public ErrorMessageCode getErrorCode() {
        return errorCode;
    }

    public void addArguments(String key, Object value) {
        arguments.put(key, value);
    }

    public Map<String, Object> getArguments() {
        return arguments;
    }
}
