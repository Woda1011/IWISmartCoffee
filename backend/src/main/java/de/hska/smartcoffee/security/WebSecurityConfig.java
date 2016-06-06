package de.hska.smartcoffee.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.session.SessionManagementFilter;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/campuscard").permitAll()
                .antMatchers("/api/telemetry/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/students").permitAll()
                .antMatchers("/api/**").authenticated()
                .and()
                .logout().logoutUrl("/api/logout").logoutSuccessHandler(logoutSuccessHandler())
                .and()
                .httpBasic().authenticationEntryPoint(authenticationEntryPoint())
                .and()
                .csrf().csrfTokenRepository(csrfTokenRepository()).requireCsrfProtectionMatcher(getRequestMatcher())
                .and()
                .addFilterAfter(new CsrfHeaderFilter(), SessionManagementFilter.class)
        ;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth, CustomUserDetailsService customUserDetailsService)
            throws Exception {
        auth.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new CustomBasicAuthenticationEntryPoint("smartcoffee-realm");
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return new CustomLogoutSuccessHandler();
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private RequestMatcher getRequestMatcher() {
        return new RequestMatcher() {
            private Pattern allowedMethods = Pattern.compile("^(GET|HEAD|TRACE|OPTIONS)$");

            @Override
            public boolean matches(HttpServletRequest request) {
                // No CSRF due to allowedMethod
                if (allowedMethods.matcher(request.getMethod()).matches())
                    return false;

                // No CSRF due to telemetry call
                if (request.getRequestURI().equals("/api/telemetry"))
                    return false;

                // CSRF for everything else
                return true;
            }
        };
    }
}