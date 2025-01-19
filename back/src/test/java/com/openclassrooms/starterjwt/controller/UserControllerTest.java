package com.openclassrooms.starterjwt.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:cleanup.sql")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    public void setUp() throws Exception {

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user-delete@example.com");
        loginRequest.setPassword("test!1234");

        String response = mockMvc.perform(MockMvcRequestBuilders
                .post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        jwtToken = objectMapper.readValue(response, JwtResponse.class).getToken();
    }

    @Test
    public void GetUserByID() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/user/1")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("admin@example.com"))
                .andExpect(jsonPath("$.firstName").value("adminFirst"))
                .andExpect(jsonPath("$.lastName").value("adminLast"));
    }


    @Test
    public void GetUserByIDWrong() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/user/coucou")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void GetAnotherUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/user/999")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    public void DeleteSelf() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/api/user/3")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());
    }

    @Test
    public void DeleteAnotherUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/api/user/2")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void DeleteWrongUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/api/user/wrong")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void DeleteUnexistingUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/api/user/999")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }
}