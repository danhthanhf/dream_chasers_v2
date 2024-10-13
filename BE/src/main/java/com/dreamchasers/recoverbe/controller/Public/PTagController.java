package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.TagService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/tag")
@RequiredArgsConstructor
public class PTagController {
    private final TagService tagService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> searchByName(@RequestParam String name) {
        var result = tagService.searchTagByName(name);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll() {
        var result = tagService.getAll();
        return ResponseEntity.status(result.getStatus()).body(result);
    }

}
