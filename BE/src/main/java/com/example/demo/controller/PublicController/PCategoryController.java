package com.example.demo.controller.PublicController;


import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.Category;
import com.example.demo.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/category")
@RequiredArgsConstructor
public class PCategoryController {

    private final CategoryService categoryService;

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "5") int size) {
        var result = categoryService.getAllCategory(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
    @GetMapping("")
    public ResponseEntity<ResponseObject> getCategoryByName(@RequestParam String name, @RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "5") int size) {
        var result = categoryService.getByTitle(name, page, size);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable int id) {
        var category = categoryService.getById(id);
        if(category == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(category);
    }

}