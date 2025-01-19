package com.openclassrooms.starterjwt.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

import static org.junit.jupiter.api.Assertions.assertFalse;;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@AutoConfigureMockMvc
public class JWTUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    public void testInvalidToken() {

        assertFalse(jwtUtils.validateJwtToken("wrong"));
    }
}
