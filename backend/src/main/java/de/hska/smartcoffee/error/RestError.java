package de.hska.smartcoffee.error;

import java.util.Date;
import java.util.Map;

public class RestError {

    // basic spring security fields
    private final String error;
    private final String message;
    private final Date timestamp;

    private final String code;
    private final Map<String, Object> messageArgs;

    public RestError(ErrorMessageCode code, String message) {
        this(code, message, null);
    }

    public RestError(CoreException exception) {
        this(exception.getErrorCode(), exception.getMessage(), exception.getArguments());
    }

    public RestError(ErrorMessageCode code, String message, Map<String, Object> messageArgs) {
        this.code = code.getValue();
        this.error = "error " + code;
        this.message = message;
        this.timestamp = new Date(System.currentTimeMillis());
        this.messageArgs = messageArgs;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getCode() {
        return code;
    }

    public Map<String, Object> getMessageArgs() {
        return messageArgs;
    }
}
