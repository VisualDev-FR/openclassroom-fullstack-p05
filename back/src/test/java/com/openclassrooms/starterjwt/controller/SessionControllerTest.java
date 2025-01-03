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
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Date;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:cleanup.sql")
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    public void setUp() throws Exception {
        String loginRequest = "{\"email\": \"admin@example.com\", \"password\": \"test!1234\"}";
        String response = mockMvc.perform(MockMvcRequestBuilders
                .post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        jwtToken = objectMapper.readValue(response, JwtResponse.class).getToken();
    }

    @Test
    public void GetSessionById() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/session/1")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Session 1"))
                .andExpect(jsonPath("$.description").value("My description"));
    }

    @Test
    void GetUnexistingSessionById() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/session/999")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void GetAllSessions() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/session")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void CreateSession() throws Exception {

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Session3");
        sessionDto.setDescription("description");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);

        mockMvc.perform(MockMvcRequestBuilders
                .post("/api/session")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session3"))
                .andExpect(jsonPath("$.description").value("description"));
    }

    @Test
    void ParticipateSession() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .post("/api/session/2/participate/2")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());
    }

    @Test
    void UpdateSession() throws Exception {

        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Updated Session");
        sessionDto.setDescription("Updated description");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);

        mockMvc.perform(MockMvcRequestBuilders
                .put("/api/session/1")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Session"))
                .andExpect(jsonPath("$.description").value("Updated description"));
    }

    @Test
    void UnparticipateSession() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/api/session/1/participate/1")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());
    }
}
