package com.openclassrooms.starterjwt.unittests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    void testCreate() {
        Session session = new Session();
        session.setDescription("description");

        when(sessionRepository.save(any())).thenReturn(session);

        sessionService.create(session);

        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testDelete() {
        Long sessionId = 1L;

        doNothing().when(sessionRepository).deleteById(sessionId);

        sessionService.delete(sessionId);

        verify(sessionRepository, times(1)).deleteById(sessionId);
    }

    @Test
    void testFindAll() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());

        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertEquals(2, result.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void testGetById() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(sessionId);

        assertNotNull(result);
        assertEquals(sessionId, result.getId());
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    void testUpdate() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        session.setDescription("Updated description");

        when(sessionRepository.save(any())).thenReturn(session);

        Session result = sessionService.update(sessionId, session);

        assertNotNull(result);
        assertEquals("Updated description", result.getDescription());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipate() {
        Long sessionId = 1L;
        Long userId = 2L;
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>());
        User user = new User();
        user.setId(userId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(sessionRepository.save(any())).thenReturn(session);

        sessionService.participate(sessionId, userId);

        assertEquals(1, session.getUsers().size());
        assertEquals(userId, session.getUsers().get(0).getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipate_UserAlreadyParticipating() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(Arrays.asList(user));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));

        verify(sessionRepository, never()).save(any());
    }

    @Test
    void testNoLongerParticipate() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(Arrays.asList(user));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any())).thenReturn(session);

        sessionService.noLongerParticipate(sessionId, userId);

        assertTrue(session.getUsers().isEmpty());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testNoLongerParticipate_UserNotParticipating() {
        Long sessionId = 1L;
        Long userId = 2L;
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));

        verify(sessionRepository, never()).save(any());
    }
}
