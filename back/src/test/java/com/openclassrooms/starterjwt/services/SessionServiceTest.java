package com.openclassrooms.starterjwt.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Assertions;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:cleanup.sql")
public class SessionServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionService sessionService;

    @Test
    public void testGetSessionByID() {
        Session session = sessionService.getById(1L);
        assertNotNull(session);
        assertEquals("Session 1", session.getName());
    }

    @Test
    public void testCreateSession() {

        Session newSession = new Session()
                .setName("sessionName")
                .setDescription("description")
                .setDate(new java.util.Date());

        Session createdSession = sessionService.create(newSession);
        assertNotNull(createdSession.getId());
        assertEquals("sessionName", createdSession.getName());
        assertEquals("description", createdSession.getDescription());
    }

    @Test
    public void testAlreadyParticipate() {

        Assertions.assertThrowsExactly(BadRequestException.class, () -> {
            sessionService.participate(1L, 1L);
        });
    }

    @Test
    public void testParticipateWithInvalidUser() {

        Assertions.assertThrowsExactly(NotFoundException.class, () -> {
            sessionService.participate(99L, 1L);
        });
    }

    @Test
    public void testParticipate() {
        sessionService.participate(2L, 2L);
        Session session = sessionService.getById(2L);
        assertTrue(session.getUsers().contains(userRepository.findById(2L).get()));
    }

    @Test
    public void testUnparticipate() {
        sessionService.noLongerParticipate(1L, 1L);
        Session session = sessionService.getById(1L);
        assertFalse(session.getUsers().contains(userRepository.findById(1L).get()));
    }

    @Test
    public void testUnparticipateWithInvalidUser() {

        Assertions.assertThrowsExactly(NotFoundException.class, () -> {
            sessionService.noLongerParticipate(99L, 1L);
        });
    }

    @Test
    public void testAlreadyUnParticipate() {

        sessionService.noLongerParticipate(1L, 1L);

        Assertions.assertThrowsExactly(BadRequestException.class, () -> {
            sessionService.noLongerParticipate(1L, 1L);
        });
    }
}
