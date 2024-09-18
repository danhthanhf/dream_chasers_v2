package com.example.demo.service;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class UploadService {

    @Autowired
    private CloudService cloudService;

    public ResponseObject uploadImg(byte[] img) {
        var result = cloudService.uploadImage(img);
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject uploadVideo(byte[] video) {
        var result = cloudService.uploadVideo(video);
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }
}
