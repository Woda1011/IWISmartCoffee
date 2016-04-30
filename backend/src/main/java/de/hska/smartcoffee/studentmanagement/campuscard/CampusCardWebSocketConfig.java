package de.hska.smartcoffee.studentmanagement.campuscard;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class CampusCardWebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(campusCardHandler(), "/campuscard").setAllowedOrigins("*");
    }

    @Bean
    public CampusCardHandler campusCardHandler() {
        return new CampusCardHandler();
    }
}
