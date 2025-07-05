package com.danhthanhf.distantclass.controller.privateApi;

import com.danhthanhf.distantclass.common.response.ResponseObject;
import com.danhthanhf.distantclass.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/upload")
public class UploadController {
    private final UploadService uploadService;
    @PostMapping("/file")
    public ResponseEntity<ResponseObject> uploadImg(@RequestPart MultipartFile file) {
        var result = uploadService.uploadFile(file);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
