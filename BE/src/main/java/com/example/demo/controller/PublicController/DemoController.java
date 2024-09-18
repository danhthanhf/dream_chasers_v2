package com.example.demo.controller.PublicController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public")
public class DemoController {
    @GetMapping
    public String demo() {
        return "hello public";
    }
}
