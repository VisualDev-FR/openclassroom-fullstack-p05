package com.openclassrooms.starterjwt.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import com.openclassrooms.starterjwt.models.Teacher;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.List;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:cleanup.sql")
public class TeacherServiceTest {

    @Autowired
    private TeacherService teacherService;

    @Test
    public void FindAllTeachers() {
        List<Teacher> teachers = teacherService.findAll();
        assertEquals(2, teachers.size());
    }

    @Test
    public void FindTeacherByID() {
        Teacher foundTeacher = teacherService.findById(1L);

        assertNotNull(foundTeacher);
        assertEquals("Margot", foundTeacher.getFirstName());
    }

    @Test
    public void TeacherNotFound() {
        Teacher foundTeacher = teacherService.findById(999L);
        assertNull(foundTeacher);
    }
}
