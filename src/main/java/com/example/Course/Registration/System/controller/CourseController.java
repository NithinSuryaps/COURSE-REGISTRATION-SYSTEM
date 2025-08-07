package com.example.Course.Registration.System.controller;

import com.example.Course.Registration.System.model.Course;
import com.example.Course.Registration.System.model.CourseRegistry;
import com.example.Course.Registration.System.serivice.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5500")
@RestController
public class CourseController {
    @Autowired
    CourseService courseservice;
    @GetMapping("/courses")
    public List<Course> avalaiblecourse(){
        return courseservice.getavalaiblecourse();
    }
    @GetMapping("/courses/enrolled")
    public List<CourseRegistry> enrolledStudent(){
        return courseservice.getEnrolledStudent();
    }
    @PostMapping("/courses/enroll")
    public String enrollCourse(@RequestParam("name") String name,
                               @RequestParam("emailId") String emailId,
                               @RequestParam("courseName") String courseName){
        courseservice.enrollCourse(name,emailId,courseName);
        return "Congratulation! "+name+" course enrolled successfully";
    }

}
