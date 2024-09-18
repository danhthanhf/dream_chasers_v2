package com.example.demo.service;

import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.QTag;
import com.example.demo.entity.data.Tag;
import com.example.demo.repository.data.TagRepository;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAUpdateClause;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private EntityManager entityManager;

    public ResponseObject searchTagByName(String name) {
        if (name == null || name.isEmpty()) {
            return ResponseObject.builder()
                    .content(Collections.emptyList())
                    .status(HttpStatus.OK)
                    .build();
        }
        var tags = new JPAQuery<Tag>(entityManager)
                .from(QTag.tag)
                .where(QTag.tag.name.trim().toLowerCase().contains(name.trim().toLowerCase()))
                .fetch()
                .stream().limit(5);
        return ResponseObject.builder()
                .content(tags)
                .status(HttpStatus.OK)
                .build();
    }

    @Transactional
    public List<Tag> saveTags(List<Tag> tags) {
        if (tags == null || tags.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> tagNames = tags.stream()
                .map(Tag::getName)
                .collect(Collectors.toList());

        List<Tag> existingTags = new JPAQuery<Tag>(entityManager)
                .from(QTag.tag)
                .where(QTag.tag.name.in(tagNames))
                .fetch();

        List<String> existingTagNames = existingTags.stream()
                .map(Tag::getName)
                .collect(Collectors.toList());

        List<Tag> notExist = tags.stream().filter(tag -> !existingTagNames.contains(tag.getName()))
                .toList();

        new JPAUpdateClause(entityManager, QTag.tag)
                .where(QTag.tag.name.in(existingTagNames))
                .set(QTag.tag.sumP, QTag.tag.sumP.add(1))
                .execute();

        tagRepository.saveAll(notExist) ;

        return new JPAQuery<Tag>(entityManager)
                .from(QTag.tag)
                .where(QTag.tag.name.in(tagNames))
                .fetch();
    }
}
