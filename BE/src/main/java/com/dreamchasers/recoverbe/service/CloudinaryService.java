package com.dreamchasers.recoverbe.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.EagerTransformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    @Async("taskExecutor")
    public CompletableFuture<String> uploadFile(MultipartFile image) {
        try {
              Map map = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap("resource_type", "auto", "folder", "dream_chasers_v2"));
            if(map != null) {
                return CompletableFuture.completedFuture((map.get("secure_url").toString()));
            }
            return CompletableFuture.completedFuture(null);

        }
        catch (IOException ex) {
            log.error("Error while uploading image: ", ex);
            return CompletableFuture.completedFuture(null);
        }
    }

    @Async("taskExecutor")
    public CompletableFuture<List<String>> uploadFiles(List<MultipartFile> files) {
        try {
            List<String> secureUrls = new ArrayList<>();
            for(var file: files) {
                Map map = cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap("resource_type", "video",
                                "folder", "dream_chasers_v2",
                                "eager", Arrays.asList(
                                        new EagerTransformation().width(300).height(300).crop("pad").audioCodec("none"),
                                        new EagerTransformation().width(160).height(100).crop("crop").gravity("south").audioCodec("none")),
                                "eager_async", true));
            secureUrls.add(map.get("securet_url").toString());
            }
            return CompletableFuture.completedFuture(secureUrls);
        } catch (IOException e) {
            log.error("Lỗi khi upload videos: ", e);
            return CompletableFuture.completedFuture(null);
        }
    }
}
