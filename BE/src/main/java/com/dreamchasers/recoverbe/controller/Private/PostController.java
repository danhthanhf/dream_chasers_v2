package com.dreamchasers.recoverbe.controller.Private;

import com.dreamchasers.recoverbe.model.User.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/private/post")
public class PostController {

    @PostMapping
    public String greeting(@RequestBody String username) {
        System.out.println(username);
        return "Hello post";
    }
}
