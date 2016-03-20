package de.hska.smartcoffee.security;

import de.hska.smartcoffee.error.ErrorMessageCode;
import de.hska.smartcoffee.error.RestError;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomBasicAuthenticationEntryPoint extends BasicAuthenticationEntryPoint {

    ObjectMapper objectMapper = new ObjectMapper();

    public CustomBasicAuthenticationEntryPoint(String realmName) {
        super();
        setRealmName(realmName);
    }

    @Override
    public void commence(final HttpServletRequest request, final HttpServletResponse response,
                         final AuthenticationException authException) throws IOException, ServletException {

        // Prevent adding WWW-Authenticate Header

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        RestError error = new RestError(ErrorMessageCode.BAD_CREDENTIALS, authException.getLocalizedMessage());

        objectMapper.writeValue(response.getOutputStream(), error);
    }
}
