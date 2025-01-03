package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionService sessionService;

    private User adminUser;

    // @BeforeEach
    // public void setUp() {
    //     adminUser = userRepository.findByEmail("admin@example.com").orElseThrow(NotFoundException::new);
    // }

    // @Test
    // public void testCreateSession() {
    //     Session newSession = new Session()
    //             .setName("New Yoga Session")
    //             .setDescription("A new description")
    //             .setDate(new java.util.Date());

    //     Session createdSession = sessionService.create(newSession);
    //     assertNotNull(createdSession.getId());
    //     assertEquals("New Yoga Session", createdSession.getName());
    // }

    // @Test
    // public void testCreate() {
    //     assertNotNull(adminUser);
    //     assertEquals(adminUser.getEmail(), "admin@example.com");
    // }

    // @Test
    // public void testDelete() {

    // }
}
