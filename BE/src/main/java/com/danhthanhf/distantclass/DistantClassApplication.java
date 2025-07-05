package com.danhthanhf.distantclass;

import com.danhthanhf.distantclass.repository.CourseRepository;
import com.danhthanhf.distantclass.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
@EnableAsync
public class DistantClassApplication {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(DistantClassApplication.class, args);
    }

//    @Bean
//    publicApi CommandLineRunner commandLineRunner() {
//        return (args) -> {
//           courseRepository.findAll().stream().peek(course -> course.setAuthor(userRepository.findByEmail("admin@gmail.com").get())).forEach(courseRepository::save);
//        };
//    }

}
