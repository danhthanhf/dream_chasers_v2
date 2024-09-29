package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadService {
    private final CloudinaryService cloudinaryService;

    public ResponseObject uploadFile(MultipartFile file)  {
        try {
            var imgUrl = cloudinaryService.uploadFile(file);
            return ResponseObject.builder().status(HttpStatus.OK).content(imgUrl.get()).build();
        }
        catch (Exception ex) {
            log.error("Error while uploading image: ", ex);
            return ResponseObject.builder().status(HttpStatus.INTERNAL_SERVER_ERROR).content("Lỗi tải lên ảnh").build();
        }
    }
}
