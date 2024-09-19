package com.dreamchasers.recoverbe.controller.Public;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/course")
public class PCourseController {
    @GetMapping
    public String greeting() {
        return "Hello from Course Controller";
    }
}
