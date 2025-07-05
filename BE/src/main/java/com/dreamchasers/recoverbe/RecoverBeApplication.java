package com.dreamchasers.recoverbe;

import com.dreamchasers.recoverbe.repository.CourseRepository;
import com.dreamchasers.recoverbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
@EnableAsync
public class RecoverBeApplication {
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(RecoverBeApplication.class, args);
    }

//    @Bean
//    public CommandLineRunner commandLineRunner() {
//        return (args) -> {
//           courseRepository.findAll().stream().peek(course -> course.setAuthor(userRepository.findByEmail("admin@gmail.com").get())).forEach(courseRepository::save);
//        };
//    }

}
