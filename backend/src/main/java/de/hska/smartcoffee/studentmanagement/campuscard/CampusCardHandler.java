package de.hska.smartcoffee.studentmanagement.campuscard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class CampusCardHandler extends TextWebSocketHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(CampusCardHandler.class);

    /**
     * All open WebSocket sessions
     */
    private static Set<WebSocketSession> peers = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        peers.add(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession webSocketSession, TextMessage textMessage) {
        CampusCard campusCard = new CampusCard(textMessage.getPayload());
        peers.forEach(session -> send(session, campusCard));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus status) {
        peers.remove(webSocketSession);
        LOGGER.debug("Closing connection with status: " + status.getReason());
    }

    private void send(WebSocketSession session, CampusCard campusCard) {
        try {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(campusCard.getId()));
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
