package com.dreamchasers.recoverbe.dto;

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
