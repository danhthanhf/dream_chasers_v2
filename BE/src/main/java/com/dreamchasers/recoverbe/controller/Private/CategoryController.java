package com.dreamchasers.recoverbe.controller.Private;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.entity.CourseKit.Category;
import com.dreamchasers.recoverbe.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/private/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAll(@RequestParam Boolean deleted, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        var result = categoryService.getAll(deleted, page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable UUID id, @RequestBody Category category) {
        var result = categoryService.updateById(id, category);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseObject> create(@RequestBody Category category) {
        var result = categoryService.createCategory(category.getName());
        return ResponseEntity.status(result.getStatus()).body(result);
    }


    @DeleteMapping("/delete/soft/{id}")
    public ResponseEntity<ResponseObject> softDelete(@PathVariable UUID id) {
        var result = categoryService.softDelete(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/delete/soft/list")
    public ResponseEntity<ResponseObject> softDeleteList(@RequestParam List<UUID> ids) {
        var result = categoryService.softDeleteList(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/restore/{id}")
    public ResponseEntity<ResponseObject> restore(@PathVariable UUID id) {
        var result = categoryService.restoreCategoryById(id);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @DeleteMapping("/restore/list")
    public ResponseEntity<ResponseObject> restoreList(@RequestParam List<UUID> ids) {
        var result = categoryService.restoreListCategory(ids);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

//    @DeleteMapping("/delete/hard/{id}")
//    public ResponseEntity<ResponseObject> hardDelete(@PathVariable int id) {
//        var result = categoryService.hardDelete(id);
//        return ResponseEntity.status(result.getStatus()).body(result);
//    }
}
