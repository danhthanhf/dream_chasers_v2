package com.example.demo.dto;

import com.example.demo.entity.data.Post;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class PagePostDTO {
    private List<PostDTO> posts;
    private int totalPage;
    private long totalElement;
    private long totalApproved;
    private long totalRejected;
    private long totalPending;
}
