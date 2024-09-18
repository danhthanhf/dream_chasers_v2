package com.example.demo;

import com.example.demo.jwt.JwtService;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
public class DreamChasersApplication {


    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public static void main(String[] args) {
        SpringApplication.run(DreamChasersApplication.class, args);
    }


//	@Bean
//    CommandLineRunner commandLineRunner (AuthService authService) {
//		return args -> {
//			User user = User.builder()
//					.firstName("nguyen")
//					.lastName("user")
//					.email("user@gmail.com")
//					.password(passwordEncoder.encode("1234Thanh@"))
//					.role(Role.USER)
//					.build();
//			System.out.println(jwtService.generateToken(user));
//			User admin = User.builder()
//					.firstName("nguyen")
//					.lastName("admin")
//					.email("admin@gmail.com")
//					.password(passwordEncoder.encode("1234Thanh@"))
//					.role(Role.ADMIN)
//					.build();
//			System.out.println(jwtService.generateToken(admin));
//
//			User manager = User.builder()
//					.firstName("nguyen")
//					.lastName("manager")
//					.email("manager@gmail.com")
//					.password(passwordEncoder.encode("1234Thanh@"))
//					.role(Role.MANAGER)
//					.build();
//			System.out.println(jwtService.generateToken(manager));
//
//			userRepository.saveAll(List.of(user, admin, manager));
//		};
//	}
}
