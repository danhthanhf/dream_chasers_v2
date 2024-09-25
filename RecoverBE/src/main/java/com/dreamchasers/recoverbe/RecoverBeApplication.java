package com.dreamchasers.recoverbe;

import com.dreamchasers.recoverbe.model.User.Role;
import com.dreamchasers.recoverbe.model.User.User;
import com.dreamchasers.recoverbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
public class RecoverBeApplication {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(RecoverBeApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner() {
        return (args) -> {
            User admin = User.builder().email("admin@gmail.com").password(passwordEncoder.encode("1234Thanh@")).role(Role.ADMIN).build();
            User manager = User.builder().email("manager@gmail.com").password(passwordEncoder.encode("1234Thanh@")).role(Role.MANAGER).build();
            User user = User.builder().email("user@gmail.com").password(passwordEncoder.encode("1234Thanh@")).role(Role.USER).build();
            userRepository.save(admin);
            userRepository.saveAll(List.of(user, manager, admin));
        };
    }

}
