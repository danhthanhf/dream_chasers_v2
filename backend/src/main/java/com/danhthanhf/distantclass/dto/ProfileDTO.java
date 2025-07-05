package com.danhthanhf.distantclass.dto;

import lombok.*;

import java.util.List;


@Getter
public class ProfileDTO<T> extends UserBasicDTO{
    private String bio;
    private List<T> data;

    public ProfileDTO(String email, String firstName, String lastName, String bio, String avatarUrl, String phoneNumber, List<T> data) {
        super(email, firstName, lastName, avatarUrl, phoneNumber);
        this.bio = bio;
        this.data = data;
    }
}