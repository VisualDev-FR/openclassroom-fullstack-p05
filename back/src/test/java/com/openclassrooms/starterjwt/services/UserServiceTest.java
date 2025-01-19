package com.openclassrooms.starterjwt.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.Optional;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:cleanup.sql")
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void DeleteUser() {
        userService.delete(3L);
        Optional<User> deletedUser = userRepository.findById(3L);
        assertFalse(deletedUser.isPresent());
    }

    @Test
    void FindUserByID() {
        User foundUser = userService.findById(1L);
        assertNotNull(foundUser);
        assertEquals("admin@example.com", foundUser.getEmail());
    }

    @Test
    void UserNotFound() {
        User foundUser = userService.findById(999L);
        assertNull(foundUser);
    }
}
