package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.model.CourseKit.Category;
import com.dreamchasers.recoverbe.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category getByName(String name) {
        return categoryRepository.findCategoryByName(name).orElse(null);
    }

    public List<Category> getListByName(List<String> names) {
        return categoryRepository.findCategoriesByNameIn(names);
    }

    public ResponseObject getAll(boolean deleted, int page, int size) {
        var categories = categoryRepository.findAllByDeleted(deleted, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).message("Get successfully").content(categories).build();
    }

    public ResponseObject updateById(UUID id, Category request) {
        ResponseObject[] res = new ResponseObject[1];
        categoryRepository.findById(id).ifPresentOrElse(c -> {
            c.setName(request.getName());
            res[0] = ResponseObject.builder().status(HttpStatus.NO_CONTENT).content(categoryRepository.save(c)).build();
        }, () -> {
            res[0] = ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Category not found").build();
        });
        return res[0];
    }

    public ResponseObject createCategory(String name)
    {
        var result = categoryRepository.findByName(name);
        if(result == null) {
            result = Category.builder().name(name).build();
            categoryRepository.save(result);
            return ResponseObject.builder().status(HttpStatus.OK).message("Create category successfully").build();
        }
        return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Category existed").build();
    }


 }
