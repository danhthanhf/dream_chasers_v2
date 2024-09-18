package com.example.demo.controller.PrivateController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/public/upload")
public class UploadController {

    @Autowired
    private UploadService uploadService;

    @PostMapping("/img")
    public ResponseEntity<ResponseObject> uploadImg(@RequestPart(name = "file") MultipartFile img) throws IOException {
        var result = uploadService.uploadImg(img.getBytes());
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @PostMapping("/video")
    public ResponseEntity<ResponseObject> uploadVideo(@RequestPart(name = "file") MultipartFile video) throws IOException {
        var result = uploadService.uploadVideo(video.getBytes());
        return ResponseEntity.status(result.getStatus()).body(result);
    }



}
