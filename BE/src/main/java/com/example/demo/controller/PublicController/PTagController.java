package com.example.demo.controller.PublicController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/tag")
public class PTagController {

    @Autowired
    private TagService tagService;
    @GetMapping("")
    public ResponseEntity<ResponseObject> getTagByName(@RequestParam String name) {
        var result = tagService.searchTagByName(name);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
