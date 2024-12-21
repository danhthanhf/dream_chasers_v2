package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.CategoryAndCoursePriceDTO;
import com.dreamchasers.recoverbe.exception.EntityNotFoundException;
import com.dreamchasers.recoverbe.helper.converters.ConvertService;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.entity.CourseKit.Category;
import com.dreamchasers.recoverbe.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ConvertService convertService;

    public ResponseObject getAllAndPrice(int page, int size) {
        var categories = categoryRepository.findAllByDeleted(false, PageRequest.of(page, size));
        CategoryAndCoursePriceDTO dto = CategoryAndCoursePriceDTO.builder()
                .categories(categories)
                .prices(convertService.convertToListCoursePriceDTO())
                .build();
        return ResponseObject.builder().status(HttpStatus.OK).content(dto).build();
    }

    public ResponseObject restoreListCategory(List<UUID> ids) {
        List<Category> categories = categoryRepository.findAllById(ids);
        categories.forEach(category -> category.setDeleted(false));
        categoryRepository.saveAll(categories);
        return ResponseObject.builder().status(HttpStatus.OK).build();
    }

    public ResponseObject restoreCategoryById(UUID id) {
        var category = categoryRepository.findById(id).orElse(null);
        if(category == null) return ResponseObject.builder().message("Category does not exist").status(HttpStatus.BAD_REQUEST).build();
        category.setDeleted(false);
        categoryRepository.save(category);
        return ResponseObject.builder().status(HttpStatus.OK).build();
    }

    public ResponseObject softDeleteList(List<UUID> ids) {
        List<Category> categories = ids.stream().map(id -> categoryRepository.findById(id).orElse(null)).toList();
        if(categories.contains(null)) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Category does not exist!").build();
        }
        boolean canDelete = false;
        for(var category : categories) {
            if(categoryRepository.existCourseByCategoryId(category.getId()) > 0) {
                canDelete = true;
                break;
            }
            category.setDeleted(true);
        }
        if(canDelete) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Category has course!").build();
        }
        categoryRepository.saveAll(categories);
        return ResponseObject.builder().status(HttpStatus.OK).build();
    }

    public ResponseObject softDelete(UUID id) {
        var category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Category does not exist!").build();
        }
        if (categoryRepository.existCourseByCategoryId(id) > 0) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Category has course!").build();
        }
        category.setDeleted(true);
        categoryRepository.save(category);
        return ResponseObject.builder().status(HttpStatus.NO_CONTENT).build();
    }

    public Category getByName(String name) {
        return categoryRepository.findCategoryByName(name).orElse(null);
    }

    public ResponseObject getById(UUID id) {
        final ResponseObject[] result = new ResponseObject[1];
        categoryRepository.findById(id).ifPresentOrElse((cate) -> {
            result[0] = ResponseObject.builder().status(HttpStatus.OK).content(cate).build();
        }, () -> {
            result[0] = ResponseObject.builder().status(HttpStatus.NOT_FOUND).message("Category not found").build();
        });
        return result[0];
    }

    public ResponseObject getByTitleContaining(String title, int page, int size) {
        var result = categoryRepository.findByNameContaining(title, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject getAllCategory(int page, int size) {
        var categories = categoryRepository.findAllByDeleted(false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(categories).build();
    }

    public void UpdateCountTotalCourseForListCategory(List<Category> categories, boolean isAdd) {
        for(var category : categories) {
            category.setTotalCourse(category.getTotalCourse() + 1);
        }
        categoryRepository.saveAll(categories);
    }

    public List<Category> getListByID(List<UUID> ids) {
        return categoryRepository.findAllById(ids);
    }

    public List<Category> getListByName(List<String> names) {
        return categoryRepository.findAllByNameIn(names);
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
        var result = categoryRepository.findByName(name).orElse(null);
        if(result == null) {
            result = Category.builder().name(name).build();
            categoryRepository.save(result);
            return ResponseObject.builder().status(HttpStatus.OK).message("Create category successfully").build();
        }
        return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).message("Category existed").build();
    }

    private boolean isContain(List<Category> categories, String name) {
        for(var category : categories) {
            if(category.getName().equals(name)) {
                return true;
            }
        }
        return false;
    }

    public List<Category> updateCategoriesForCourse(List<Category> oldCategories, List<String> newCategories) {
        var updateCategories = new ArrayList<Category>();
        if(newCategories == null || newCategories.isEmpty()) {
            oldCategories.forEach(category -> {
                category.setTotalCourse(category.getTotalCourse() - 1);
                if(category.getTotalCourse() == 0) {
                    category.setDeleted(true);
                }
            });
            categoryRepository.saveAll(oldCategories);
            return updateCategories;
        }

        oldCategories.forEach(c -> {
            if(newCategories.contains(c.getName())) {
                updateCategories.add(c);
            } else {
                c.setTotalCourse(c.getTotalCourse() - 1);
            }
        });

        newCategories.forEach(name -> {
           if(!isContain(oldCategories, name)) {
                var newCategory = categoryRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Category not found"));
                newCategory.setTotalCourse(newCategory.getTotalCourse() + 1);
                updateCategories.add(newCategory);
           }
        });

        return updateCategories;
    }


}
