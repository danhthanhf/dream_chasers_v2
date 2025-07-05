package com.dreamchasers.recoverbe.controller.Public;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/public/category")
public class PCategoryController {
    private final CategoryService categoryService;

    @GetMapping("/price/getAll")
    public ResponseEntity<ResponseObject> getAllPrice(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = categoryService.getAllAndPrice(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }


    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = categoryService.getAllCategory(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("")
    public ResponseEntity<ResponseObject> getCategoryByName(@RequestParam String name, @RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "5") int size) {
        var result = categoryService.getByTitleContaining(name, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }



    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getById(@PathVariable UUID id) {
        var category = categoryService.getById(id);
        if(category == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(category);
    }

}
