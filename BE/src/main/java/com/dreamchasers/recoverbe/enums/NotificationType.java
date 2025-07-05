package com.dreamchasers.recoverbe.enums;

import lombok.Data;
import lombok.Getter;

@Getter
public enum NotificationType {
    COURSE_PUBLISHED ("COURSE PUBLISHED"),
    COURSE_PENDING ("COURSE PENDING"),
    COURSE_APPROVED ("COURSE APPROVED"),
    COURSE_REJECTED ("COURSE REJECTED"),
    COURSE_COMMENT ("COURSE COMMENT"),
    COURSE_LIKE ("COURSE LIKE"),
    COURSE_VOTE ("COURSE VOTE"),
    POST_PUBLISHED ("POST PUBLISHED"),
    POST_APPROVED  ("POST APPROVED"),
    POST_REJECTED ("POST REJECTED"),
    POST_PENDING ("POST REJECTED"),
    POST_COMMENT ("POST COMMENT"),
    POST_LIKE ("POST LIKE"),
    POST_VOTE ("POST VOTE"),
    COMMENT_REPLY ("COMMENT REPLY"),
    NEW_COMMENT ("NEW COMMENT"),
    ADD_FRIEND ("ADD FRIEND");

    NotificationType(String value) {
        this.value = value;
    }
    private final String value;



}
