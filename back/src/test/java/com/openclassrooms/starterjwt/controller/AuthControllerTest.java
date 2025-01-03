package com.openclassrooms.starterjwt.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:cleanup.sql")
public class AuthControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void logInWithValidCredentials() throws Exception {

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@example.com");
        loginRequest.setPassword("test!1234");

        mockMvc.perform(MockMvcRequestBuilders
                .post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$.token").value(any(String.class)))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    public void loginWithInvalidCredentials() throws Exception {

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@example.com");
        loginRequest.setPassword("invalidPassword");

        mockMvc.perform(MockMvcRequestBuilders
                .post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void registerSucessfull() throws Exception {

        SignupRequest payload = new SignupRequest();
        payload.setEmail("user-new@example.com");
        payload.setPassword("password");
        payload.setFirstName("firstName");
        payload.setLastName("lastName");

        mockMvc.perform(MockMvcRequestBuilders
                .post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("User registered successfully!")));
    }

    @Test
    public void registerFailIfAlreadyExists() throws Exception {

        SignupRequest payload = new SignupRequest();
        payload.setEmail("user@example.com");
        payload.setPassword("password");
        payload.setFirstName("firstName");
        payload.setLastName("lastName");

        mockMvc.perform(MockMvcRequestBuilders
                .post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is already taken!")));
    }

}
