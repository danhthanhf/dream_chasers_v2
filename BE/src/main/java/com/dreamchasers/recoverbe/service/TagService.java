package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.dreamchasers.recoverbe.entity.post.QTag;
import com.dreamchasers.recoverbe.entity.post.Tag;
import com.dreamchasers.recoverbe.repository.TagRepository;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAUpdateClause;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final EntityManager entityManager;

    public ResponseObject getAll() {
        var tag = new JPAQuery<>(entityManager)
                .from(QTag.tag)
                .fetch();
        return ResponseObject.builder().status(HttpStatus.OK).content(tag).build();
    }

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
                .set(QTag.tag.totalPost, QTag.tag.totalPost.add(1))
                .execute();

        tagRepository.saveAll(notExist) ;

        return new JPAQuery<Tag>(entityManager)
                .from(QTag.tag)
                .where(QTag.tag.name.in(tagNames))
                .fetch();
    }
}
