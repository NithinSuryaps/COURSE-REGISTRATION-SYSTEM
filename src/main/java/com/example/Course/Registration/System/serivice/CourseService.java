package com.example.Course.Registration.System.serivice;

import com.example.Course.Registration.System.model.Course;
import com.example.Course.Registration.System.model.CourseRegistry;
import com.example.Course.Registration.System.repository.CourseRegistrationRepository;
import com.example.Course.Registration.System.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    @Autowired
    CourseRepository courserepository;
    @Autowired
    CourseRegistrationRepository courseregistrationrepository;

    public List<Course> getavalaiblecourse() {
        return courserepository.findAll();
    }

    public List<CourseRegistry> getEnrolledStudent() {
        return courseregistrationrepository.findAll();
    }

    public void enrollCourse(String name, String emailId, String coursename) {
        CourseRegistry c=new CourseRegistry(name,emailId,coursename);
        courseregistrationrepository.save(c);
    }
}
