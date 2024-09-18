package com.example.demo.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.EagerTransformation;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.entity.data.Course;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudService {
    private final Cloudinary cloud;

    public String uploadImage(byte[] file)  {
        try {
            Map map = cloud.uploader().upload(file, ObjectUtils.asMap("resource_type", "auto", "folder", "dacs"));
            if(map != null) {
                return (map.get("secure_url").toString());
            }
        }
        catch (Exception e) {
            System.out.println("getLinkCloud: " + e.getMessage());
            return null;
        }
        return null;
    }

    public List<String> uploadVideos(List<MultipartFile> filesData){
        List<String> secureUrls = new ArrayList<>();
        for (var fileData : filesData) {
           try {
               Map map = cloud.uploader().upload(fileData.getBytes(),
                       ObjectUtils.asMap("resource_type", "video",
                               "folder", "dacs",
                               "eager", Arrays.asList(
                                       new EagerTransformation().width(300).height(300).crop("pad").audioCodec("none"),
                                       new EagerTransformation().width(160).height(100).crop("crop").gravity("south").audioCodec("none")),
                               "eager_async", true));
//                            "eager_notification_url", "https://mysite.example.com/notify_endpoint"));
               secureUrls.add(map.get("secure_url").toString());
           } catch (Exception e) {
               System.out.println("Upload videos: " + e.getMessage());
           }
        }
        return secureUrls;
    }

    public String uploadVideo(byte[] video) {
        try {
            Map map = cloud.uploader().upload(video,
                    ObjectUtils.asMap("resource_type", "video",
                            "folder", "dacs",
                            "eager", Arrays.asList(
                                    new EagerTransformation().width(300).height(300).crop("pad").audioCodec("none"),
                                    new EagerTransformation().width(160).height(100).crop("crop").gravity("south").audioCodec("none")),
                            "eager_async", true));
//                            "eager_notification_url", "https://mysite.example.com/notify_endpoint"));
        }
        catch (Exception e) {
            System.out.println("Cloud upload video: " + e.getMessage());
        }
        return null;
    }

    @Async("asyncExecutor")
    public void saveImageToCourse(byte[] file, Course course) throws IOException {
        try {
            Map map = cloud.uploader().upload(file, ObjectUtils.asMap("resource_type", "auto", "folder", "dacs"));
            if(map != null) {
                course.setThumbnail(map.get("secure_url").toString());
            }
        }
        catch (Exception e) {
            System.out.println("saveImageToCourse: " + e.getMessage());
        }
    }
}
